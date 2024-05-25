const router = require('express').Router();
const passport = require('passport');

// Login route
router.get(
    '/login',
    passport.authenticate('github'),
    (request, response) => {
        //#swagger.tags=['Authentication']
    }
);

// Logout route
router.get('/logout', function (request, response, next) {
    //#swagger.tags=['Authentication']
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
        // #swagger.ignore = true
        console.log('Authentication success');
        request.session.user = request.user;
        response.redirect('/');
    }
);
router.get('/', (request, response) => {
    response.status(200).json({ message: 'Login Status' });
});

module.exports = router;
