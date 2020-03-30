import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";

//Init app
let app = express();

// Connect to MongoDB
ConnectDB();

// Config view engine
configViewEngine(app);

//Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Hello Minh Huy, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});