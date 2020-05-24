import express from "express";
import {home, auth} from "./../controllers/index";
import {authValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";


// Init all passport
initPassportLocal();
initPassportFacebook();

let router = express.Router(); //Function trong express

/**
 * Init all routes
 * @param app from exaclty express module 
 */

let initRoutes = (app) => {
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);

  router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);

  router.get("/verify/:token", auth.checkLoggedOut, auth.verifyAccount);

   //Đường dẫn "/login/" phải trùng với action trong views/auth/login/login.ejs form login
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true, //Truyền flash request về
    failureFlash: true
  }));

  //Đường dẫn /auth/facebook ở trong views/auth/login/login.ejs tại form login facebook có href="/auth/facebook"
  router.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email"]}));
  //Callback url từ FB_CALLBACK_URL trong env.sh
  router.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register",
  }));
  router.get("/", auth.checkLoggedIn, home.getHome);
  //Đường dẫn "/logout" trùng với href ở trong views/main/navbar/navbar.ejs
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);

  return app.use("/", router); 
};

module.exports = initRoutes;