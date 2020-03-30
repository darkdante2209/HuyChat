import express from "express";
import {home, auth} from "./../controllers/index";

let router = express.Router(); //Function trong express

/**
 * Init all routes
 * @param app from exaclty express module 
 */

let initRoutes = (app) => {
  router.get("/", home.getHome);
  
  router.get("/login-register", auth.getLoginRegister);

  return app.use("/", router); 
};

module.exports = initRoutes;