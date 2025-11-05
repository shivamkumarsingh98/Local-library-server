// passport/google.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = function setupGoogle() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        // callback should match backend endpoint:
        callbackURL:
          process.env.GOOGLE_CALLBACK 
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // normalize email
          const email =
            profile.emails && profile.emails[0] && profile.emails[0].value
              ? profile.emails[0].value.toLowerCase()
              : null;

          // try find by googleId OR email (to avoid duplicates)
          let user = null;
          if (profile.id) {
            user = await User.findOne({ googleId: profile.id });
          }
          if (!user && email) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              name: profile.displayName || "No Name",
              email,
              googleId: profile.id,
            });
          } else {
            // if user exists but googleId missing, attach it
            if (!user.googleId && profile.id) {
              user.googleId = profile.id;
              await user.save();
            }
          }

          done(null, user);
        } catch (err) {
          console.error("GoogleStrategy error:", err);
          done(err, null);
        }
      }
    )
  );
};
