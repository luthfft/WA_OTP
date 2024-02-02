const express = require("express");
const app = express();
const port = 3000;
const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

const qr;
const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("qr", (qr) => {
  // QR code will be generated and displayed on the client side
  qr=qr;
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
            // Make an AJAX request to trigger QR code generation
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "/generateQR", true);
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4 && xhr.status == 200) {
                // Update the qrCodeContainer with the received QR code
                qrCodeContainer.innerHTML = `<img src="data:image/png;base64,${xhr.responseText}">`;
              }
            };
            xhr.send();
          });
        </script>
      </body>
    </html>
  `);
});

app.get("/generateQR", (req, res) => {
  // Generate the QR code
  const qrCode = qrcode.generateSync(qr); // Replace with your actual data
  // Send the QR code as a response
  res.send(qrCode);
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
