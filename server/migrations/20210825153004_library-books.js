
exports.up = function (knex) {
  return knex.schema.createTable('books', table => {
    table.increments('id').primary()
    table.string('book_title').notNullable()
    table.string('author').notNullable()
    table.bigInteger('isbn').notNullable()
    table.integer('checked_out_to').defaultTo(null)
    table.date('checked_out_until').defaultTo(null)
  })
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('books')
};
