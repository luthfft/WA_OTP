const express = require("express");
const app = express();
const port = 3000;
const qrcode = require("qrcode-terminal");
const { Client } = require("whatsapp-web.js");
const fs = require("fs");

const client = new Client();

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
  console.log(qr);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  } else if (msg.body == "!salwa") {
    msg.reply("salwa cantik");
  }
});

client.initialize();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/sendto", (req, res) => {
  let number = req.query.number;
  let message = req.query.message;

  number = number.substring(1);
  number = `62${number}@c.us`;

  client.sendMessage(number, message);
  res.send("Message sent!");
  res.json({ status: false });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
