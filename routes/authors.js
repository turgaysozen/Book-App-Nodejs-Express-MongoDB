const express = require('express');
const router = express.Router();
const Author = require('../models/author');

//All authors route
router.get('/', async (req, res) => {
    let searchObject = {}
    if (req.query.name != null && req.query.name !== '') {
        searchObject.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchObject);
        res.render('authors/index', {
            authors: authors,
            searchObject: req.query
        });
    } catch{
        res.redirect('/');
    }
   // res.render('authors/index');
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
        const newAuthor = await author.save();
        res.redirect(`authors`);
    } catch  {
        res.render('authors/new', {
            author: author,
            errorMessage: author +' Error Creating Author'
        });
    }


    // author.save((err, newAuthor) => {
    //     if (err) {
    //         res.render('authors/new', {
    //             author: author,
    //             errorMassage: 'Error Creating Author'
    //         });
    //     } else res.redirect(`authors`);
    // });
});

module.exports = router;