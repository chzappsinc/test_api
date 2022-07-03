var jwt = require("jsonwebtoken");

function VerifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (token == undefined) {
    res.status(500).json({
      MessageChannel: 1,
      message: "UnAuthorized user, please check your Auth key",
    });
  }
  let token_verified = token.split(" ").pop();
  jwt.verify(token_verified, process.env.SECRET_KEY, (err, decode) => {
    if (err) {
      res.status(500).json({
        message: "user not Authorized for this activity",
        MessageChannel: 2,
      });
    } else {
      next();
    }
  });
}

module.exports = VerifyToken;
