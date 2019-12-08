const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

//All book route
router.get('/', async (req, res) => {
    let searchObject = {};
    //let query = Book.find();
    if (req.query.title != null && req.query.title !== '') {
        //query = query.regex('title', new Regex(req.query.title, 'i'));
        searchObject.title = new RegExp(req.query.title, 'i');
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
        searchObject.publishedBefore = query.lte('publishDate', req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
        searchObject.publishedAfter = query.gte('publishDate', req.query.publishedAfter);
    }
    try {
        const books = await Book.find(searchObject).sort({ createdAt: 'asc' }).limit(50).exec();
        const authors = await Author.find();
        res.render('books/index', {
            books: books,
            searchObject: req.query,
            authors: authors
        });
    } catch{
        res.redirect('/');
    }
});

// New book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});

// Create new book
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
    });
    try {
        saveCover(book, req.body.cover);
        const newBook = await book.save();
        res.redirect('books');
    }
    catch{
        renderNewPage(res, book, true);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const author = await Author.findById(book.author);

        res.render('books/view', {
            book: book,
            author: author,
        });
    } catch (err) {
        console.log(err)
        res.redirect('/books');
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        const authors = await Author.find();
        res.render('books/edit', {
            book: book,
            authors: authors,
        });
    } catch  {
        res.redirect('/books');
    }
});

router.put('/:id', async (req, res) => {
    try {
        let book;
        book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover);
        }
        await book.save();
        const author = await Author.findById(book.author);
        res.render('books/view', {
            book: book,
            author: author
        });
    } catch {
        res.redirect('/books');
    }
});

router.delete('/:id', async (req, res) => {
    let book;
    try {
        book = await Book.findById(req.params.id);
        if (book != null) {
            await book.remove();
            res.redirect('/books');
        }
    }
    catch {
        if (book != null) {
            res.redirect(`/books/${book.id}`);
        }
        else {
            res.redirect('/books');
        }
    }
});

async function renderNewPage(res, book, hasError = false) {
    try {
        let authors = await Author.find({});
        let params = {
            authors: authors,
            book: book,
        }
        if (hasError) params.errorMessage = 'Error Creating Book';
        res.render('books/new', params);
    }
    catch{
        res.redirect('/books');
    }
}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}

module.exports = router;