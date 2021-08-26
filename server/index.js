const express = require('express');
const app = express();
const port = 3030;
const knex = require('knex')(require('./knexfile.js')['development']);
const cors = require('cors');
const e = require('express');

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
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    })
});

//Returns a single book entry from books table, matching the bookId
app.get('/api/books/:bookId', (req, res) => {
  const parsedId = parseInt(req.params.bookId)
  if(parsedId) {
    knex.select('*')
      .from('books')
      .where('id', parsedId)
      .then(data => {
        if(data.length === 0) {
          res.status(404).json({message: "No book found."});
        } else {
          res.status(200).json(data[0]);
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send();
      })
  } else {
    res.status(400).json({message: `Bad request: received ${req.params.bookId}`});
  }
});

const formattedDate = (date) => {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

//Returns whether a particular book is already checked out
app.get('/api/books/:bookId/checkout/:userId', (req, res) => {
  const parsedBookId = parseInt(req.params.bookId)
  const parsedUserId = parseInt(req.params.userId)
  if(parsedBookId && parsedUserId) {
    knex.select('checked_out_to', 'checked_out_until')
      .from('books')
      .where({'id': parsedBookId})
      .then(data => {
        if(data.length === 0) {
          res.status(404).json({message: "No book found."});
        } else {
          // build the message around which user you are
          const checkedOutTo = data[0].checked_out_to;
          const checkedOutUntil = new Date(data[0].checked_out_until);
          let response = {};
          if (!checkedOutTo) { 
            response.message = 'This book is available for checkout.'
            response.checkedOut = false;
          } else if (parsedUserId === checkedOutTo) {
            response.message = 'Book is already checked out to you.'
            response.checkedOut = true;
          } else {
            response.message = `Book checked out by another user; will be available ${formattedDate(checkedOutUntil)}.`
            response.checkedOut = true;
          }
          res.status(200).json(response);
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send();
      })
  } else {
    res.status(400).json({message: `Bad request: received book id: ${req.params.bookId} and user id: ${req.params.userId}`});
  }
});

//Sets userId into checked_out_to column of a book entry from books table, matching the bookId
app.patch('/api/books/:bookId/checkout/:userId', (req, res) => {
  const parsedBookId = parseInt(req.params.bookId)
  const parsedUserId = parseInt(req.params.userId)

  const getDateTwoWeeksFromNow = () => {
    let result = new Date();
    result.setDate(result.getDate() + 14);
    return result;
  }

  const checkoutBook = () => {
    knex.from('books')
      .update({
        checked_out_to: parsedUserId, 
        checked_out_until: getDateTwoWeeksFromNow()
      })
      .where({'id': parsedBookId})
      .returning('*')
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        throw err;
      })
  }

  if (parsedBookId && parsedUserId) {
    //Checking whether book is available for checkout
    knex.select('checked_out_to')
      .from('books')
      .where({'id': parsedBookId})
      .then(data => {
        if(data.length === 0) {
          res.status(404).json({ message: "No book found." });
        } else if(data[0].checked_out_to) {
          res.status(403).json({message: `Book ${parsedBookId} is already checked out.`})
        } else {
          checkoutBook();
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).send();
      })
  } else {
    res.status(400).json({message: `Bad request: received book id: ${req.params.bookId} and user id: ${req.params.userId}`});
  }
});

//Sets checked_out_to and checked_out_until of a book entry from books table, matching the bookId
app.patch('/api/books/:bookId/return', (req, res) => {
  const parsedBookId = parseInt(req.params.bookId);
  if(parsedBookId) {
    knex.from('books')
      .update({
        checked_out_to: null,
        checked_out_until: null
      })
      .where({'id': parsedBookId})
      .returning('*')
      .then(data => {
        if(data.length === 0) {
          res.status(404).json({message: `No book with id ${parsedBookId} found.`})
        } else {
          res.status(200).json(data[0]);
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).send();
      })
  } else {
    res.status(400).json({message: `Bad request: received book id ${req.params.bookId}`})
  }
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});