// var express = require("express");
import express from "express";
let app = express();

let hostname = "localhost";
let port = 2209;

app.get("/helloworld", (req,res) => {
  res.send("<h1>Hellow world !!!!</h1>");
});

app.listen(port, hostname, () => {
  console.log(`Hello Minh Huy, I'm running at ${hostname}:${port}/`);
});