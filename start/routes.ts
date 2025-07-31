/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/questions', 'ChatController.store')
Route.get('/conversation', 'ChatController.index') // Ambil semua conversation [cite: 16]
Route.get('/conversation/:id', 'ChatController.show') // Ambil message dari conversation [cite: 19]
// Rute tambahan untuk nilai plus
Route.delete('/conversation/:id', 'ChatController.destroy')
