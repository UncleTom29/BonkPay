const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Merchant = require('../models/Merchant');

passport.use(new LocalStrategy({
  usernameField: 'email',
}, async (email, password, done) => {
  try {
    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    const isMatch = await merchant.matchPassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }

    return done(null, merchant);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((merchant, done) => {
  done(null, merchant.id);
});

passport.deserializeUser((id, done) => {
  Merchant.findById(id, (err, merchant) => {
    done(err, merchant);
  });
});
