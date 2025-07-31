import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('conversation_id').unsigned().references('id').inTable('conversations').onDelete('CASCADE')
      table.string('sender_type').notNullable() // 'user' atau 'bot'
      table.text('message').notNullable()
      table.timestamp('created_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
