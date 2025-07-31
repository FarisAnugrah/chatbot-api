// app/Validators/PostQuestionValidator.ts

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostQuestionValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    // 'question' harus ada dan berupa string. Tidak boleh kosong.
    question: schema.string([rules.trim()]),

    // 'session_id' bersifat opsional
    session_id: schema.string.optional([rules.trim()]),
  })

  public messages = {
    'question.required': 'The question field is required.',
    'question.string': 'The question must be a string.',
  }
}
