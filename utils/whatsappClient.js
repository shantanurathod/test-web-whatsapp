const { Client, LocalAuth } = require("whatsapp-web.js");
const xlsx = require("xlsx");
const { deleteFile } = require("./deleteFile");
const path = require("path");
const qrCode = require("qrcode-terminal");
// const fileInfo = require('../utils/fileInfoVars')

class SendMessage {
  constructor(socket) {
    this.socket = socket;
    this.currentStatus = 0;
    this.pause = false;
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });

    this.client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      qrCode.generate(qr, { small: true });
      this.socket.emit("qrGenerated", qr);
    });

    this.client.on("authenticated", () => {
      console.log("Client is ready!");
      this.socket.emit("clientReady", true);
    });
  }

  pauser() {
    return new Promise((resolve) => {
      this.socket.on("pauseSending", () => {
        console.log("pause clicked");
        this.pause = true;
      });
      this.socket.on("resumeSending", () => {
        console.log("play clicked");
        this.pause = false;
      });
      if (!this.pause) {
        console.log("resolved");
        resolve("resuming sending messages");
      }
    });
  }

  delay(t) {
    return new Promise((resolve) => {
      setTimeout(resolve, t);
    });
  }
  async loopMessage(fileInfo) {
    //   if (this.pause) return "loop paused"
    //   console.log("fileInfo: ", fileInfo)

    const path = fileInfo.PATH_TO_SHEET;
    const file = xlsx.readFile(path);
    let sheet;

    if (!this.sheetName) {
      const allSheetNames = file.SheetNames;
      sheet = file.Sheets[allSheetNames[0]];
    } else {
      sheet = file.Sheets[sheetName];
    }

    const range = xlsx.utils.decode_range(sheet["!ref"]);
    let startingIndex;
    if (this.currentStatus != 0) {
      startingIndex = this.currentStatus;
    } else {
      startingIndex = range.s.r;
    }
    const sheetJson = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    for (let rowNum = startingIndex; rowNum <= range.e.r; rowNum++) {
      await this.pauser();
      this.currentStatus = rowNum;
      const contact = sheetJson[rowNum];
      // console.log("contact: ", contact)
      // console.log("contactColumn: ", this.contactColumn)
      const contact_number = contact[parseInt(fileInfo.contactColumn)];
      // console.log("contactnum: ", contact_number)
      const final_number = "91" + contact_number + "@c.us";
      // console.log("final num: ", final_number)
      await this.client
        .isRegisteredUser(final_number)
        .then(async (isRegistered) => {
          if (isRegistered) {
            // console.log("number is registered to whatsapp");
            await this.client
              .sendMessage(final_number, fileInfo.textMessage)
              .then(() => {
                this.socket.emit(
                  "currStatus",
                  `${this.currentStatus}.message sent to ${contact_number}`
                );
                console.log(
                  `${this.currentStatus}.message sent to ${contact_number}`
                );
              });
          } else {
            console.log(
              `${contact_number} number is not registered to whatsapp`
            );
          }
        });
      await this.delay(5 * 1000);
    }

    deleteFile(path);
    return "All messages are sent";
  }
  async oneMsg() {
    await this.client
      .sendMessage("91dummy@c.us", "new message arrived")
      .then(() => console.log("done messaging"));
  }
  async initializeClient() {
    console.log("initializing client...");
    await this.client.initialize();
  }
}

// deleteFile(path.join(__dirname, "..", "contact_sheets", "1704726303483_testList2.xlsx"))
module.exports = SendMessage;
