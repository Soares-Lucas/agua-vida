const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { users, findUserById, findOrCreateUser } = require('./data');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = findUserById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        avatarUrl: profile.photos[0].value
      };
      const dbUser = findOrCreateUser(user);
      done(null, dbUser);
    }
  )
);
