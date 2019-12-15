const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/user')

let newUser; let id;
function initialize(passport) {
    const authenticateUser = async (email, password, done) => {

        newUser = await User.findOne({ email: email });
        console.log(newUser)
        id = newUser != null ? newUser.id : null;
        if (newUser == null) {
            return done(null, false, { message: 'No user with that email address' });
        }
        try {
            if (await bcrypt.compare(password, newUser.password)) {
                return done(null, newUser);
            }
            else {
                return done(null, false, { message: 'Password Incorrect' });
            }
        } catch  {
            return done();
        }
    }
    passport.use(new localStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((newUser, done) => done(null, id));
    passport.deserializeUser((id, done) => { return done(null, newUser) });
}

module.exports = initialize;
