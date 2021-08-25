const express = require('express');
const app = express();
const port = 3030;
const knex = require('knex')(require('./knexfile.js')['development']);
const cors = require('cors');

var options = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
};
app.use(cors(options));
app.use(express.json());

//Returns all entry from books table with all of its columns
app.get('/api/books', (req, res) => {
  knex.select('*')
    .from('books')
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({
          message: 'No books found.'
        })
      } else {
        res.status(200).json(data)
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).send()
    })
});

//Returns a single book entry from books table, matching the bookId
app.get('/api/books/:bookId', (req, res) => {

});

//Returns whether a particular book is already checked out
app.get('/api/books/:bookId/checkout/:userId', (res, req) => {

});

//Sets userId into checked_out_to column of a book entry from books table, matching the bookId
app.patch('/api/books/:bookId/checkout/:userId', (res, req) => {

});

//Sets checked_out_to and checked_out_until of a book entry from books table, matching the bookId
app.patch('/api/books/:bookId/return', (res, req) => {

})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)

});