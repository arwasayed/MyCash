
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');


console.log('Google Auth Environment Variables:', {
  clientID: !!process.env.GOOGLE_CLIENT_ID,
  callbackURL: process.env.GOOGLE_CALLBACK_URL

});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
   
      accessType: 'offline',
      prompt: 'consent'
      // passReqToCallback: true,
      // scope: ['profile', 'email'],

    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile Data Received:', {
          id: profile.id,
          emails: profile.emails,
          photos: profile.photos,
          displayName: profile.displayName
        });

        
        if (!profile.emails || !profile.emails[0]) {
          throw new Error('Google authentication failed: No email provided');
        }

        
        const email = profile.emails[0].value;
        const nickname = profile.displayName || `user${Math.random().toString(36).substring(2, 10)}`;
        const avatar = (profile.photos && profile.photos[0]) ?
          profile.photos[0].value :
          'https://example.com/default-avatar.png';

        // 3. البحث عن مستخدم موجود أو إنشاء جديد
        let user = await User.findOne({
          $or: [
            { email },
            { googleId: profile.id }
          ]
        });

        if (!user) {
          user = await User.create({
            email,
            nickname,
            avatar,
            emailVerified: true,
            provider: 'google',
            googleId: profile.id
          });
          console.log('New user created:', user);
        } else {
         
          user.avatar = avatar;
          user.googleId = profile.id;
          await user.save();
          console.log('Existing user updated:', user);
        }

        return done(null, user);
      } catch (err) {
        console.error('Google Authentication Error:', {
          message: err.message,
          stack: err.stack,
          profile: {
            id: profile?.id,
            emails: profile?.emails,
            photos: profile?.photos
          }
        });
        return done(err);
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize User
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error('Deserialize User Error:', err);
    done(err);
  }
});

module.exports = passport;
