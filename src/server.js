import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash"
import session from "./config/session";
import passport from "passport";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketIo from "./config/socketio";
import events from "events";
import * as configApp from "./config/app";

// import pem from "pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }
//   // Init app
//   let app = express();

//   // Connect to MongoDB
//   ConnectDB();

//   // Config session
//   configSession(app);

//   // Config view engine
//   configViewEngine(app);

//   // Enable post data for request
//   app.use(bodyParser.urlencoded({extended: true}));

//   // Enable flash message
//   app.use(connectFlash());

//   // Config passport js
//   app.use(passport.initialize());
//   app.use(passport.session());

//   //Init all routes
//   initRoutes(app);

 
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//     console.log(`Hello Minh Huy, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
//   });
// })

// Init app
let app = express();

// Set tối đa connection event cho listeners
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;

// Init server với socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

// Connect to MongoDB
ConnectDB();

// Config session
session.config(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}));

// Enable flash message
app.use(connectFlash());

// User cookie parser
app.use(cookieParser());

// Config passport js
app.use(passport.initialize());
app.use(passport.session());

//Init all routes
initRoutes(app);

// Cấu hình để socket.io lấy giữ liệu từ trong session ra
configSocketIo(io, cookieParser, session.sessionStore);

// Init all sockets
initSockets(io);//sẽ nhận io sau đó chuyền tới các hàm nhỏ hơn trong hàm initSockets, từ đó truyền về client

server.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Hello Minh Huy, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});