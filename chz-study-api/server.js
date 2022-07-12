var express = require("express");
var connection = require("./config/connect");
var cors = require("cors");
var path = require("path");
var fs = require("fs");
require("dotenv").config();

const UploadRouter = require("./router/upload");
const UserRoute = require("./router/users");
const CronJobRouter = require("./cronjobs/cronjob");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
app.use(express.static(__dirname + "/html"));

// Routes
app.use("/user", UserRoute);
app.use("/upload", UploadRouter);
app.use("/cron-jobs", CronJobRouter);

// Handle error on empty path
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/html/common.html"));
});

// Connect to database
connection.connect((err) => {
  if (err) throw err;
});

// App listen to localhost
app.listen(8120, (err) => {
  if (err) throw err;
});

// fs.readFile(
//   "./../values/delete.txt",
//   "utf8",
//   function readFileCallback(err, data) {
//     if (err) {
//       console.log(err);
//     } else {
//       const req = data.split("\n");
//       const updated = req.map((i) => {
//         let f = i.split("=");
//         return {
//           key: f[0],
//           value: f[1].replace("\r", ""),
//         };
//       });
//       console.log(updated[5].key);
//     }
//   }
// );

/**
 * Written by Chzapps india
 *
 * @see https://chzapps.com
 * @see https://github.com/chzappsinc
 *
 */
