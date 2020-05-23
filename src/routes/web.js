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
  router.get("/", home.getHome);
  
  router.get("/login-register", auth.getLoginRegister);

  router.post("/register", authValid.register, auth.postRegister);

  router.get("/verify/:token", auth.verifyAccount);

  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true, //Truyền flash request về
    failureFlash: true
  })); //Đường dẫn "/login/" phải trùng với action trong views/auth/login/login.ejs form login

  return app.use("/", router); 
};

module.exports = initRoutes;