const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json("Not Authorized");
    }

    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    req.user = payload.user;
    req.userType = payload.userType;
    req.expiry = payload.exp;
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(403).json("Not Authorized");
  }
};
