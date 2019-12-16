const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
    let page = req.query.page;
    let books = [];
    try {
        const books = await Book.find({}).skip((page - 1) * 12).limit(12);
        if (req.isAuthenticated()) {
            res.render('index', {
                books: books, 
                name: req.user.name,
                allBooks: await Book.find(),
                searchObject: null,
                page: page,
            });
        } else {
            res.render('index', {
                books: books,
                allBooks: await Book.find(),
                searchObject: null,
                page: page,
            });
        }
    }
    catch{
        books = [];
    }
});

module.exports = router;