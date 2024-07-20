const multer = require("multer");
const fileInfo = require("../utils/fileInfoVars");
const path = require("path")

//Multer middleware configuration
let finalFilename;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "contact_sheets");
  },

  filename: (req, file, cb) => {
    // console.log("file_uploaded-->", file);
    finalFilename = Date.now() + "_" + file.originalname;
    
    fileInfo.PATH_TO_SHEET = path.join(__dirname, "..", "contact_sheets", finalFilename)
    // console.log("path:", path)
    cb(null, finalFilename);
  },
});
const upload = multer({ storage: storage });
// exports.finalFilename = finalFilename
exports.upload = upload;
