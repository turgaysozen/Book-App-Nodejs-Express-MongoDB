const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');

//All authors route
router.get('/', async (req, res) => {
    let searchObject;
    if (req.query.name != null && req.query.name !== '') {
        searchObject.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchObject);
        res.render('authors/index', {
            authors: authors,
            searchObject: req.query,
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
        res.render('authors/new', {
            author: author,
            errorMessage: author + ' Error Creating Author'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(10).exec();
        res.render('authors/view', {
            author: author,
            booksByAuthor: books,
        });
    } catch {
        res.redirect('/');
    }
});

router.get('/:id/edit', async (req, res) => {
    const author = await Author.findById(req.params.id);
    try {
        res.render('authors/edit', {
            author: author,
        });
    } catch  {
        res.redirect('/authors');
    }
});

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
                author: author,
                errorMessage: 'Error Updating Author',
            });
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (author != null) {
            author.remove();
            res.redirect('/authors');
        }
    } catch  {
        if(author != null){
            res.redirect(`/authors/${author.id}`);
        }
        else res.redirect('/authors');
    }
});

module.exports = router;