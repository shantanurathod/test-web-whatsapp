const { Server } = require("socket.io");
const fileInfo = require("../utils/fileInfoVars");
const SendMessage = require("../utils/whatsappClient");
const { deleteSessionCache } = require("../utils/deleteSessionCache");

exports.socketConnection = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });
  io.on("connection", (socket) => {
    console.log(`Client connected with id:${socket.id}`);
    deleteSessionCache();
    let sendMessage;
    socket.on("createSession", (ack) => {
      sendMessage = new SendMessage(socket);
      sendMessage.initializeClient();
      socket.on("startSending", async () => {
        // console.log("event reached", fileInfo)
        // sendMessage.pause != sendMessage.pause
        const res = await sendMessage.loopMessage(fileInfo);
        console.log(res);
        // await sendMessage.oneMsg()
      });
    });
  });
};
