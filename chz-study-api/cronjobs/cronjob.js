var express = require("express");
var fs = require("fs");
var moment = require("moment");
const { setFileServer } = require("../config/functions");

const CronJobRouter = express.Router();

CronJobRouter.all("/delete-files", async (req, res) => {
  let deleted = 0;
  fs.readdir("./../uploads/temp/", (err, files) => {
    files.forEach((file) => {
      fs.stat("./../uploads/temp/" + file, (err, stats) => {
        if (err) {
          throw err;
        }
        const time = moment(stats.mtime.toISOString()).add(30, "minutes");
        setFileServer(
          "./../values/delete.txt",
          /^#LAST_UPDATED.*$/gm,
          `#LAST_UPDATED=${moment().toISOString()}`
        );
        if (moment().isAfter(time)) {
          fs.unlinkSync("./../uploads/temp/" + file);
          deleted = deleted + 1;
          setFileServer(
            "./../values/delete.txt",
            /^#LAST_DELETE.*$/gm,
            `#LAST_DELETED=${deleted}`
          );
        }
      });
    });
  });
  res.status(200).json({
    message: "Task run; we are not guarantee in deleting files",
    deleted: deleted,
  });
});

// Developed By chzapps india,

module.exports = CronJobRouter;

// [c] CHZAPPS INDIA LMT...
