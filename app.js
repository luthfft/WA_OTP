const express = require("express");
const app = express();
const port = 3000;
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("ready", () => {
  console.log("Client is ready!");
});
client.initialize();

client.on("qr", (qr) => {
  // Generate and scan this code with your phone
  qrcode.generate(qr, { small: true });
  console.log(qr);
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  } else if (msg.body == "!salwa") {
    msg.reply("salwa cantik");
  }
});

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
