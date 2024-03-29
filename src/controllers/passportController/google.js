import passport from "passport";
import passportGoogle  from "passport-google-oauth";
import UserModel from "./../../models/userModel";
import ChatGroupModel from "./../../models/chatGroupModel";
import {transErrors, transSuccess} from "./../../../lang/vi";

let GoogleStrategy = passportGoogle.OAuth2Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

/**
 * Valid user account type: google
 */

let initPassportGoogle = () => {
  passport.use(new GoogleStrategy({
    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggCallbackUrl,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await UserModel.findByGoogleUid(profile.id);
      if (user) {
        return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
      }
      console.log(profile);
      let newUserItem = {
          username: profile.name,
          gender: profile.gender,
          local: {isActive: true}, //Vì khi đăng ký tài khoản thì có isActive là false, facebook đã xác thực rồi nên để thành true
          google: {
            uid: profile.id,
            token: accessToken,
            email: profile.emails[0].value
          }
      };
      let newUser = await UserModel.createNew(newUserItem);
      return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)));
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

  passport.deserializeUser(async (id, done) => { 
    //Lưu toàn bộ thông tin vào biến req.user
      try {
        let user = await UserModel.findUserByIdForSessionToUse(id);
        let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

        user = user.toObject();
        user.chatGroupIds = getChatGroupIds;
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
      //Lưu toàn bộ thông tin vào biến req.user
  });
};

 module.exports = initPassportGoogle;