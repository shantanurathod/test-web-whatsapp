// Import the filesystem module// Get the current filenames
const fs = require("fs");
const path = require("path");

exports.deleteSessionCache = () => {
  deleteFolder(".wwebjs_auth");
  deleteFolder(".wwebjs_cache");
};

const deleteFolder = (folderName) => {
  folderName = "../" + folderName;
  rootdir = __dirname.split("/").pop();
  folderPath = path.resolve(rootdir, folderName);
  // console.log(folderPath);
  // Using the recursive option to delete
  // multiple directories that are nested
  if (fs.existsSync(folderPath)) {
    fs.rm(
      folderPath,
      {
        recursive: true,
      },
      (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Recursive: Directories Deleted!");
        }
      }
    );
  } else {
    console.log("path doesn't exist");
  }
};
