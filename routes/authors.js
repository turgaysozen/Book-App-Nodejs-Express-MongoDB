const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

//All author
router.get('/', async (req, res) => {
    let searchObject = {};
    if (req.query.name != null && req.query.name !== '') {
        searchObject.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchObject);
        const books = await Book.find();
        authors.forEach(author => {
            books.forEach(book => {
                if (author.id == book.author) {
                    author.book = true;
                }
            });
        });
        res.render('authors/index', {
            authors: authors,
            searchObject: req.query,
            books: books,
            singleauthor: new Author,
            name : req.isAuthenticated() == true ? req.user.name: null
        });
    } catch {
        res.redirect('/');
    }
});

// New author route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author });
});

// Create new authors
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name,
    });

    try {
        await author.save();
        //res.redirect(`/authors/${author.id}`);
        res.redirect('/authors');

    } catch  {
        const authors = await Author.find();
        const books = await Book.find();
        authors.forEach(author => {
            books.forEach(book => {
                if (author.id == book.author) {
                    author.book = true;
                }
            });
        });
        res.render('authors', {
            singleauthor: author,
            errorMessage: 'Error Creating Author',
            searchObject: null,
            authors: authors,
            books: books,
            name : req.isAuthenticated() == true ? req.user.name: null
        });
    }
});

// view selected author with books
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).exec();
        res.render('authors/view', {
            author: author,
            booksByAuthor: books,
            name : req.isAuthenticated() == true ? req.user.name: null

        });
    } catch {
        res.redirect('/');
    }
});

// view selected author 
router.get('/:id/edit', async (req, res) => {
    const author = await Author.findById(req.params.id);
    try {
        res.render('authors/edit', {
            singleauthor: author,
            name : req.isAuthenticated() == true ? req.user.name: null

        });
    } catch  {
        res.redirect('/authors');
    }
});

//update author
router.put('/:id', async (req, res) => {
    let author;
    try {
        author = await Author.findById(req.params.id);
        author.name = req.body.name;
        await author.save();
        res.redirect(`/authors/${author.id}`);
    } catch  {
        if (author == null) {
            res.redirect('/');
        }
        else {
            res.render('authors/edit', {
                singleauthor: author,
                errorMessage: 'Error Updating Author',
                name : req.isAuthenticated() == true ? req.user.name: null

            });
        }
    }
});

// delete author
router.delete('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (author != null) {
            author.remove();
            res.redirect('/authors');
        }
    } catch  {
        if (author != null) {
            res.redirect(`/authors/${author.id}`);
        }
        else res.redirect('/authors');
    }
});

module.exports = router;