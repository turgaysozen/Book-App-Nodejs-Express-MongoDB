const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');

const initializePassport = require('../passport-config');
initializePassport(passport);

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect('/');
    }
    else res.render('users/login', { email: req.body.email });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: true, session: true }),
    async (req, res) => {
        if (req.isAuthenticated()) {
            let books = await Book.find().sort({ createdAt: 'desc' }).exec();
            res.render('index', { name: req.user.name, books: books });
        }
        else res.render('users/login', { errorMessage: 'Error Login !' });
    });

router.get('/register', (req, res) => {
    res.render('users/register', {
    });
});

router.post('/register', async (req, res) => {
    try {
        if (await User.findOne({ email: req.body.email }) != null) {
            res.render('users/register', {
                errorMessage: 'This Email address already registered !',
            });
        }
        else {
            let hashedPassword;
            if (req.body.password != null) {
                hashedPassword = await bcrypt.hash(req.body.password, 10);
                let user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                });
                await user.save();
                res.render('users/login', {successMessage: 'Register Success', email : req.body.email});
            }
        }
    } catch  {
        res.render('users/register', {
            errorMessage: 'Register User Error !',
        });
    }
});

router.delete('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        req.logOut();
        res.redirect('/');
    }
    else res.redirect('/users/login');

});

router.get('/forget', (req, res) => {
    res.render('users/forget');
});

router.post('/forget', async (req, res) => {
    try {
        if (await User.findOne({ email: req.body.email })) {
            res.render('users/resetpsw', { email: req.body.email });
        }
        else {
            res.render('users/forget', { errorMessage: 'There is no email address like ' + req.body.email });
        }
    } catch  {
        res.redirect('users/login');
    }
});

router.get('/users/resetpsw', (req, res) => {
    res.render('users/resetpsw', { email: req.body.email });
});

router.post('/resetpsw', async (req, res) => {
    try {
        if (req.body.password == req.body.repassword) {
            let existUser = await User.findOne({ email: req.body.email });
            let newPsw = await bcrypt.hash(req.body.password, 10);
            existUser.password = newPsw;
            await existUser.save();
            res.render('users/login', { successMessage: 'Password Change Success !', email: req.body.email });
        }
        else {
            res.render('users/resetpsw', { errorMessage: 'Passwords are not match', email: req.body.email });
        }
    } catch {
        res.redirect('/users/forget');
    }
});

// function checkAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         console.log(req.user)
//         return res.redirect('/');
//     }
//     console.log(req.user)
//     res.redirect('/users/login');
// }

// function checkNotAuthenticated(req, res, next) {
//     if (req.isAuthenticated()) {
//         return res.redirect('/');
//     }
//     console.log('nooo');
//     return next();
// }

module.exports = router;