
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('books').del()
    .then(function () {
      // table.increments('id').primary()
      // table.string('book_title').notNullable()
      // table.string('author').notNullable()
      // table.integer('isbn').notNullable()
      // table.integer('checked_out_to')
      // table.date('checked_out_until')

      // Inserts seed entries
      return knex('books').insert([
        {
          book_title: 'The Lord Of The Rings',
          author: 'J. R. R. Tolkein',
          isbn: '9780007136582',
          checked_out_to: '5',
          checked_out_until: '2021-09-02'
        },
        {
          book_title: 'Cracking the Coding Interview',
          author: 'Gayle Laakmann McDowell',
          isbn: '9780984782857',
        },
        {
          book_title: 'Mythical Man-Month',
          author: 'Frederick P. Brooks, Jr.',
          isbn: '9780201835953',
        },
        {
          book_title: 'The Catcher in the Rye',
          author: 'Jerome David Salinger',
          isbn: '9780316769174',
        },
        {
          book_title: 'Lord of the Flies',
          author: 'William Golding',
          isbn: '9780399501487',
        },
      ]);
    });
};
