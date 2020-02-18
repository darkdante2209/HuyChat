import express from "express";
import ConnectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";

let app = express();

// Connect to MongoDB
ConnectDB();

app.get("/test-database", async (req,res) => {
  try {
    let item = {
      userId: "412414124",
      contactId: "4141124"
    };
    let contact = await ContactModel.createNew(item);
    res.send(contact);
  } catch (err) {
    console.log(err);
  }
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Hello Minh Huy, I'm running at ${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});