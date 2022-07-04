const fs = require("fs");

module.exports.formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

module.exports.setFileServer = (path, regex, replace) => {
  fs.readFile(path, "utf8", function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
      const req = regex;
      const val = data.replace(req, replace);
      fs.writeFile(path, val, "utf8", (err) => {
        if (err) throw err;
        // console.log("File has been saved!");
      });
    }
  });
};

// "./../values/delete.txt"
// data.replace(, `#LAST_DELETED=${deleted + 1}`);
