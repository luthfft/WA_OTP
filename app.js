const express = require("express");
const app = express();
const port = 3000;
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");

const SESSION_FILE_PATH = "./session.json";

let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionData = require(SESSION_FILE_PATH);
}

const client = new Client({
  authStrategy: new LocalAuth({
    session: sessionData,
    // Add the 'session' property with the loaded session data
  }),
});
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log(qr);
});

// Event handling
client.on("authenticated", (session) => {
  console.log("Authenticated");

  if (session) {
    sessionData = session;

    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
      if (err) console.error(err);
    });
  } else {
    console.log("Session data is undefined.");
  }
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
