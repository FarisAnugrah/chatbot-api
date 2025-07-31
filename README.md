# chatbot-api

# REST API Chatbot - AdonisJS v5

## Deskripsi
Sebuah REST API sederhana yang dibuat menggunakan AdonisJS versi 5 dan PostgreSQL untuk sistem chatbot. API ini memungkinkan pengguna mengirimkan pertanyaan, yang kemudian diteruskan ke API eksternal untuk mendapatkan jawaban. Seluruh percakapan disimpan ke dalam database.
---

## Teknologi yang Digunakan

-   **Framework**: AdonisJS v5
-   **Bahasa**: TypeScript
-   **Database**: PostgreSQL
-   **HTTP Client**: Axios
-   **Fitur Tambahan**:
    -   Validasi Input dengan AdonisJS Validator
    -   Pagination pada list data

---

## Cara Menjalankan Proyek

1.  **Clone repository ini:**
    ```bash
    git clone <URL_GITHUB_ANDA>
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd chatbot-api
    ```

3.  **Install semua dependencies:**
    ```bash
    npm install
    ```

4.  **Salin dan Konfigurasi Environment Variable:**
   sesuaikan konfigurasi database PostgreSQL Anda.
    ```bash
    cp .env.example .env
    ```

5.  **Jalankan Migrasi Database:**
    Perintah ini akan membuat tabel `conversations` dan `messages` di database.
    ```bash
    node ace migration:run
    ```

6.  **Jalankan Server:**
    ```bash
    node ace serve --watch
    ```
    API akan berjalan di `http://127.0.0.1:3333`.

---

## Daftar Endpoint API

### 1. Kirim Pertanyaan

-   **Endpoint**: `POST /questions` 
-   **Deskripsi**: Mengirim pertanyaan baru atau melanjutkan percakapan yang sudah ada.
-   **Request Body**:
    ```json
    {
      "question": "Halo, apa kabar?",
      "session_id": "optional-uuid-string"
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "session_id": "uuid-string-baru-atau-lama",
      "answer": "Jawaban dari bot..."
    }
    ```

### 2. Ambil Semua Percakapan

-   **Endpoint**: `GET /conversation`
-   **Deskripsi**: Menampilkan semua percakapan dengan pagination.
-   **Query Params**: `page` (opsional), `limit` (opsional).
-   **Contoh URL**: `http://127.0.0.1:3333/conversation?page=1&limit=5`
-   **Success Response (200 OK)**:
    ```json
    {
      "meta": {
        // ... data pagination
      },
      "data": [
        // ... array of conversation objects
      ]
    }
    ```

### 3. Ambil Detail Percakapan

-   **Endpoint**: `GET /conversation/:id`
-   **Deskripsi**: Menampilkan detail satu percakapan beserta semua pesannya.
-   **Success Response (200 OK)**:
    ```json
    {
      "id": 1,
      "session_id": "...",
      "messages": [
        { "sender_type": "user", "message": "..." },
        { "sender_type": "bot", "message": "..." }
      ]
    }
    ```

### 4. Hapus Percakapan

-   **Endpoint**: `DELETE /conversation/:id` 
-   **Deskripsi**: Menghapus satu percakapan dari database.
-   **Success Response (200 OK)**:
    ```json
    {
      "message": "Conversation deleted successfully"
    }
    ```
