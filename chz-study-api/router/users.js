var express = require("express");
var connection = require("../config/connect");
var jwt = require("jsonwebtoken");
var VerifyToken = require("../middleware/jwt");
var multer = require("multer");

const UserRoute = express.Router();
const upload = multer();
UserRoute.use(upload.array());

require("dotenv").config();

// Create Account
UserRoute.post("/create-user", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const gender = req.body.gender;

  if (username && password && first_name && last_name && gender) {
    // check username available or not
    let checkUserQuery = `select * from user_details where username = '${username}'`;
    connection.query(checkUserQuery, (err, result) => {
      if (err) {
        res.status(500).json({
          err: err,
          message: "Something went wrong!",
        });
      } else {
        if (result.length == 0) {
          // Insert new Users
          let insertUserQuery = `insert into user_details (username,password,first_name,last_name,gender,status) 
          values('${username}',sha1('${password}'),'${first_name}','${last_name}','${gender}',1)`;
          connection.query(insertUserQuery, (err, result) => {
            if (err || result.length == 0) {
              res.status(500).json({
                message:
                  "Unavailable to create user at this time, Please try again",
              });
            } else {
              res.status(200).json({
                message: "User created successfully, Now login",
              });
            }
          });
        } else {
          res.status(400).json({
            message: "Username not available",
          });
        }
      }
    });
  } else {
    res.status(500).json({
      MessageChannel: 1,
      message:
        "Please enter all fields username | password | first_name | last_name | gender",
      RequestedMethod: req.method,
      ApprovedMethod: "POST",
    });
  }
});

// User Login
UserRoute.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  //   Check username and password
  if (username && password) {
    let loginUserQuery = `select * from user_details where username = '${username}' and password = sha1('${password}')`;
    connection.query(loginUserQuery, (err, result) => {
      if (err || result.length == 0) {
        res.status(400).json({
          MessageChannel: 2,
          message: "username or password doesn't match",
        });
      } else {
        let token_details = {
          id: result[0].id,
          username: result[0].username,
        };
        // Token
        let token = jwt.sign(token_details, process.env.SECRET_KEY, {
          expiresIn: "2d",
        });
        res.status(200).json({
          MessageChannel: 3,
          message: "Login success",
          token: token,
          data: {
            first_name: result[0].first_name,
            last_name: result[0].last_name,
            user_name: result[0].username,
          },
        });
      }
    });
  } else {
    res.status(500).json({
      MessageChannel: 1,
      message: "Enter all fields username | password",
    });
  }
});

// Get user details
UserRoute.get("/user-details", VerifyToken, (req, res) => {
  const username = req.body.username;
  if (username) {
    // check user details
    let getUserQuery = `select * from user_details where username = '${username}'`;
    connection.query(getUserQuery, (err, result) => {
      if (err || result.length == 0) {
        res.status(500).json({
          message: "No such user found",
          MessageChannel: 1,
        });
      } else {
        let user_details = result[0];
        res.status(200).json({
          username: user_details.username,
          first_name: user_details.first_name,
          last_name: user_details.last_name,
          verified: user_details.status,
          gender: user_details.gender,
          Headers: req.headers.authorization,
        });
      }
    });
  } else {
    res.status(401).json({
      message: "username is missing",
    });
  }
});

module.exports = UserRoute;
