const router = require('express').Router();
const passport = require('passport');
const authentication = require('../authentication');

// Login route
router.get('/login', passport.authenticate('github'), (request, response) => {
    //#swagger.tags=['authentication']
});

// Logout route
router.get('/logout', function (request, response, next) {
    //#swagger.tags=['authentication']
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
    // #swagger.ignore = true
    response.status(200).json({
        message: `${
            request.session.user === undefined
                ? 'Logged out'
                : `Logged in as ${request.session.user.username}`
        } `,
    });
});

module.exports = router;
