import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/userModel";
import {transErrors, transSuccess} from "./../../../lang/vi";

let LocalStrategy = passportLocal.Strategy;

/**
 * Valid user account type: local
 */

let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: "email", //email in view/login.ejs/input/name="email"
    passwordField: "password", //password in view/login.ejs/input/name="password"
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      let user = await UserModel.findByEmail(email);
      if (!user){
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }
      if (!user.local.isActive) {
        return done(null, false, req.flash("errors", transErrors.account_not_active));
      }
      let checkPassword = await user.comparePassword(password);
      if (!checkPassword) {
        return done(null, false, req.flash("errors", transErrors.login_failed));
      }
      return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
    } catch (error) {
      console.log(error);
      return done(null, false, req.flash("errors", transErrors.server_error));
    }
  }));

  //Save User ID to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  //Dùng User model, lấy toàn bộ thông tin của user theo id

  passport.deserializeUser((id, done) => { 
    //Lưu toàn bộ thông tin vào biến req.user
    UserModel.findUserById(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      });
  });
};

 module.exports = initPassportLocal;