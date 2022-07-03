var express = require("express");
var connection = require("./config/connect");
var cors = require("cors");
var path = require("path");
require("dotenv").config();

const UploadRouter = require("./router/upload");
const UserRoute = require("./router/users");

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

/**
 * Written by Chzapps india
 *
 * @see https://chzapps.com
 * @see https://github.com/chzappsinc
 *
 */
