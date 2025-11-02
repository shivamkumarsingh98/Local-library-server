// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const Owner = require("../models/owner");

// module.exports = function setupGoogle() {
//   console.log("ClientID:", process.env.GOOGLE_CLIENT_ID);
//   console.log("ClientSecret:", process.env.GOOGLE_CLIENT_SECRET);
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID || "",
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//         callbackURL:
//           process.env.GOOGLE_CALLBACK ||
//           "http://localhost:3004/auth/google/callback",
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           let owner = await Owner.findOne({ googleId: profile.id });
//           if (!owner) {
//             owner = await Owner.create({
//               name: profile.displayName,
//               email:
//                 profile.emails && profile.emails[0] && profile.emails[0].value,
//               googleId: profile.id,
//             });
//           }
//           done(null, owner);
//         } catch (err) {
//           done(err);
//         }
//       }
//     )
//   );
// };
