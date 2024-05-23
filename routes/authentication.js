const router = require('express').Router();
const passport = require('passport');

// Login route
router.use(
    '/login',
    passport.authenticate('github'),
    (request, response) => {}
);

// Logout route
router.use('/logout', function (request, response, next) {
    request.logout(function (error) {
        if (error) {
            return next(error);
        }
        response.redirect('/');
    });
});

// GitHub Oauth callback
router.get(
    '/github-callback',
    passport.authenticate('github', {
        failureRedirect: '/',
        session: false,
    }),
    (request, response) => {
        console.log('Authentication success');
        request.session.user = request.user;
        response.redirect('/authentication');
    }
);
router.get('/', (request, response) => {
    response.status(200).json({ message: 'Login Status' });
});

module.exports = router;
