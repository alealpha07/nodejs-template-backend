const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

function initialize(passport, conn) {
  const authenticateUser = async (username, password, done) => {

    conn.query('SELECT * FROM Users WHERE Username = ?', [username], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        bcrypt.compare(password, result[0].Password, (err, res) => {
          if (err) throw err;
          if (res === true) {
            return done(null, result[0]);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      }
      else {
        return done(null, false, { message: 'No user with that username' });
      }
    });
  }

  passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.Id))
  passport.deserializeUser((id, cb) => {
    conn.query('SELECT * FROM Users WHERE Id = ?', [id], (err, result) => {
      if (err) throw err;
      cb(err, result[0]); //result[0] is not safe, change to result.first() or smiliar, manage case of null results
    });
  })
}

module.exports = initialize