const express = require('express');
const sql = require('mssql');
// const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      read: false,
    },
    {
      title: 'Les Misérables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false,
    },
    {
      title: 'The Time Machine',
      genre: 'Science Fiction',
      author: 'H. G. Wells',
      read: false,
    },
    {
      title: 'The Dark World',
      genre: 'Fantasy',
      author: 'Henry Kuttner',
      read: false,
    },
  ];

  bookRouter.route('/').get((req, res) => {
    // using async await - modern style fo ajax call
    (async function query() {
      const request = new sql.Request();

      const { recordset } = await request.query('select * from books');
      res.render('bookListView', {
        nav,
        title: 'Library',
        books: recordset,
      });
    }());
  });

  bookRouter
    .route('/:id')
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request
          .input('id', sql.Int, id)
          .query('select * from books where id = @id');
        // eslint-disable-next-line prefer-destructuring
        req.book = recordset[0];
        // as it is a middleware we call next
        next();
      }());
    })
    .get((req, res) => {
      res.render('bookView', {
        nav,
        title: 'Library',
        book: req.book,
      });
    });
  return bookRouter;
}

module.exports = router;
