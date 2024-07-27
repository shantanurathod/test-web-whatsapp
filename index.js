const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
// const {PATH_TO_SHEET, text, contactColumn, starting, ending, sheeet, nameColumn} = require('./setTimeOutTest.js')
const { socketConnection } = require("./src/socketConnection");
const { upload } = require("./middleware/multerMiddleware");
const fileInfo = require("./utils/fileInfoVars");

//server configuration
const app = express();
const server = http.createServer(app);
socketConnection(server);

const port = process.env.PORT || 3001;
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow all methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
};
//cors setting
app.use(cors(corsOptions));

//Session Middle-ware
let uniqueId = uuidv4();
app.use(
  session({
    name: "SessionCookie",
    genid: function (req) {
      console.log("session id created");
      return uniqueId;
    }, // use UUIDs for session IDs
    secret: "Shsh!Secret!",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(
  express.static(path.join(__dirname, "/../test-web-whatsapp-frontend/dist"))
);
//handling request get
// app.get("/", (req, res, next) => {
//   res.sendFile("public/index.html", { root: __dirname });
//   // res.send("hello mfs")
// });

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "/../test-web-whatsapp-frontend/dist", "index.html")
  );
});
//login
// app.get("/login", (req, res) => {
//   req.session.name = "shancookie";
//   res.send("<h4>Logged in successfully</h4>");
// });

//handling file upload request
app.post("/", upload.single("sheet"), (req, res) => {
  // console.log("req: ", req.body)
  for (const key in req.body) {
    if (req.body[key]) {
      fileInfo[key] = req.body[key];
    }
  }
  // fileInfo.PATH_TO_SHEET = "../contact_sheets/" + finalFilename;
  //fileInfo["finalFilename"] = finalFilename
  // console.log("FileInfo: ", fileInfo)
  //   console.log("from index: ", fileInfo)
  res.status(200).send("File uploaded successfully");
});

server.listen(port, () => console.log(`server running on port:${port}`));
