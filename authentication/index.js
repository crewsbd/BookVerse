const passport = require('passport');
const OauthStrategy = require('passport-github2').Strategy;
const usersModel = require('../models/users');

const isAuthenticated = (request, response, next) => {
    if (request.session.user === undefined) {
        return response.status(401).json('You do not have access');
    }
    //console.dir(request.session);
    next();
};

// Configure passport
console.log('Configuring passport');
const initializer = passport.initialize();
const session = passport.session();

passport.use(
    new OauthStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        async function (accessToken, refreshToken, profile, done) {
            // Add new user if needed
            console.log(`Looking up ${profile.id}`);
            let user = await usersModel.findOne({ oauthID: profile.id });

            if (!user) {
                // add them
                user = new usersModel({
                    oauthID: profile.id,
                    name: profile.displayName,
                    // userName: profile.username,
                    profileUrl: profile.profileUrl,
                    authProvider: profile.provider,
                });
                console.log(`Saving user ${profile.displayName}`);
                await user.save();
            }
            return done(null, profile);
        }
    )
);

// Set user serializer
passport.serializeUser((user, done) => {
    done(null, user); // Is this to put a user in a DB?
});

// Set user deserializer
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = { isAuthenticated, initializer, session };
