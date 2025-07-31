import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Conversation from 'App/Models/Conversation'
import PostQuestionValidator from 'App/Validators/PostQuestionValidator'

export default class ChatController {
  // POST /questions
 public async store({ request, response }: HttpContextContract) {
    // --- PERUBAHAN DI SINI ---
    // 1. Panggil validator. Jika validasi gagal, AdonisJS akan otomatis mengirim error.
    const payload = await request.validate(PostQuestionValidator)
    // 2. Ambil data dari 'payload' yang sudah tervalidasi, bukan dari request.body()
    const { question, session_id } = payload
    // --- AKHIR PERUBAHAN ---

    let conversation: Conversation

    // Cari conversation berdasarkan session_id, atau buat baru jika tidak ada
    if (session_id) {
      conversation = await Conversation.firstOrCreate(
        { sessionId: session_id },
        { sessionId: session_id }
      )
    } else {
      // Buat session_id acak jika tidak disediakan
      conversation = await Conversation.create({ sessionId: uuidv4() })
    }

    // 1. Simpan pertanyaan dari pengguna ke database
    await conversation.related('messages').create({
      senderType: 'user',
      message: question, // Gunakan 'question' dari payload
    })

    try {
      // 2. Lakukan request ke API eksternal menggunakan Axios
      const externalApiUrl = 'https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message'
      const apiResponse = await axios.post(externalApiUrl, {
        question: question,
      })

        // --- debugging ---
    // console.log('RESPONS DARI API EKSTERNAL:', JSON.stringify(apiResponse.data, null, 2))
    // ---

      // Pastikan response dari API eksternal sesuai format yang diharapkan
      // Ambil teks dari objek pertama di dalam array 'message'
const botAnswer = apiResponse.data?.data?.message?.[0]?.text;

      if (!botAnswer) {
          return response.internalServerError({ message: 'Invalid response structure from external API.' })
      }

      // 3. Simpan jawaban dari bot ke database
      await conversation.related('messages').create({
        senderType: 'bot',
        message: botAnswer,
      })

      // 4. Kembalikan jawaban ke pengguna
      return response.ok({
        session_id: conversation.sessionId,
        answer: botAnswer,
      })
    } catch (error) {
      console.error('External API call failed:', error)
      return response.internalServerError({
        message: 'Failed to communicate with the external chatbot service.',
      })
    }
  }
  // GET /conversation
    public async index({ request, response }: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const conversations = await Conversation.query().paginate(page, limit)
    return response.ok(conversations)
  }


  // GET /conversation/:id_or_uuid [cite: 19]
   public async show({ params, response }: HttpContextContract) {
    try {
      const conversationQuery = Conversation.query().preload('messages')

      // Cek apakah parameter adalah angka yang valid
      if (!isNaN(Number(params.id))) {
        // Jika ya, cari berdasarkan kolom 'id' sebagai ANGKA
        conversationQuery.where('id', Number(params.id))
      } else {
        // Jika bukan angka (berarti ini adalah session_id/UUID), cari sebagai STRING
        conversationQuery.where('session_id', params.id)
      }

      // Ambil hasilnya
      const conversation = await conversationQuery.firstOrFail()

      return response.ok(conversation)
    } catch (error) {
      return response.notFound({ message: 'Conversation not found' })
    }
  }

  // DELETE /conversation/:id (Nilai Plus)
  public async destroy({ params, response }: HttpContextContract) {
      const conversation = await Conversation.findOrFail(params.id)
      await conversation.delete()
      return response.ok({ message: 'Conversation deleted successfully' })
  }
}
