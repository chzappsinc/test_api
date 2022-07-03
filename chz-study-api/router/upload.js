var express = require("express");
var multer = require("multer");
var connection = require("../config/connect");
var crypto = require("crypto");
var urls = require("../config/uri");
var path = require("path");
var moment = require("moment");
var fs = require("fs");
var formatBytes = require("../config/functions");

const UploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // const path = crypto.randomBytes(10).toString("hex");
    // fs.mkdirSync(`./../uploads/temp/`);
    let dir = `./../uploads/temp/`;
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    // console.log(file.mimetype);
    callback(null, crypto.randomBytes(10).toString("hex") + ext);
  },
});

var upload = multer({ storage }).single("file");
UploadRouter.post("/file", (req, res) => {
  upload(req, res, (err, result) => {
    if (err) {
      res.status(500).json({
        message: "Unable to upload file",
      });
    } else {
      if (req.file) {
        res.status(200).json({
          message: "file uploaded",
          download_uri:
            urls.download_file +
            req.file.destination.replace("./../uploads/temp/", "") +
            req.file.filename,
          expire_on: moment()
            .add(30, "minutes")
            .format("DD ddd, MMM, yyyy hh:mm a"),
          expire_date: moment().add(30, "minutes"),
          autoDelete: true,
          fileName: req.file.filename,
          memeType: req.file.mimetype,
          original_name: req.file.originalname,
          size: formatBytes(req.file.size),
        });
      } else {
        res.status(500).json({
          message: "No file selected in file field",
        });
      }
    }
  });
});

module.exports = UploadRouter;
