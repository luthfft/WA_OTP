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
  res.send(`
    <html>
      <body>
        <h1>Hello World!</h1>
        <button id="generateQR">Generate QR Code</button>
        <div id="qrCode"></div>
        <script>
          const generateQRButton = document.getElementById("generateQR");
          const qrCodeContainer = document.getElementById("qrCode");

          generateQRButton.addEventListener("click", () => {
            // Add logic to fetch the QR code and display it in qrCodeContainer
            // You may need to make an AJAX request to the server to trigger QR generation

            // For demonstration purposes, you can manually show a sample QR code:
            qrCodeContainer.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAIAAADXkf7BAAAAmUlEQVR42u3BAQEAAAABIP6PzgpLn5AAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAA4JwPHwABF7r/AwAAAABJRU5ErkJggg==">';
          });
        </script>
      </body>
    </html>
  `);
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
