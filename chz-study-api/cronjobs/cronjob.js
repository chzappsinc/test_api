var express = require("express");
var fs = require("fs");
var moment = require("moment");

const CronJobRouter = express.Router();

CronJobRouter.all("/delete-files", (req, res) => {
  fs.readdir("./../uploads/temp/", (err, files) => {
    files.forEach((file) => {
      fs.stat("./../uploads/temp/" + file, (err, stats) => {
        if (err) {
          throw err;
        }
        const time = moment(stats.mtime.toISOString()).add(30, "minutes");
        if (moment().isAfter(time)) fs.unlinkSync("./../uploads/temp/" + file);
      });
    });
  });
  res.status(200).json({
    message: "Module Runner",
  });
});

// Developed By chzapps india,

module.exports = CronJobRouter;