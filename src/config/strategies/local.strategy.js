const passport = require('passport');
const { Strategy } = require('passport-local');

// tell passport about localStrategy
module.exports = function localStrategy() {
  passport.use(
    new Strategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      (username, password, done) => {
        const user = {
          username,
          password,
        };
        done(null, user);
      },
    ),
  );
};
