import express from "express";
import {home, auth} from "./../controllers/index";
import {authValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";


// Init all passport
initPassportLocal();

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

  router.get("/", auth.checkLoggedIn, home.getHome);
  //Đường dẫn "/logout" trùng với href ở trong views/main/navbar/navbar.ejs
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);

  return app.use("/", router); 
};

module.exports = initRoutes;