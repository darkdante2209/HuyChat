import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

/**
 * This variable is where save session, in this case is MongoDB
 */
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
  // autoRemove: "native"
})

/**
 * Config session for app
 * @param app from exactly express module
 */

let config = (app) => {
  app.use(session({
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 8640000 miliseconds = 1 day
    }
  }));
};

module.exports = {
  config: config,
  sessionStore: sessionStore
};