const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.auth = async (req, res, next) => {
  const token = req.header("x-api-key");

  if (!token) {
    return res
      .status(400)
      .json({ err: "You need send token to this endpoint or url " });
  }
  try {
    const decodeToken = jwt.verify(token, process.env.SECRET);
    req.tokenData = decodeToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(502).json({ err: "Token invalid or expired " });
  }
};

exports.authAdmin = async (req, res, next) => {
  const token = req.header("x-api-key");

  if (!token) {
    return res
      .status(401)
      .json({ err: "You need send token to this endpoint or url 111" });
  }
  try {
    const decodeToken = jwt.verify(token, process.env.SECRET);
    if (decodeToken.role != "admin") {
      return res
        .status(401)
        .json({ err: "You must send token of admin to this endpoint" });
    }

    req.tokenData = decodeToken;
    next();
  } catch (err) {
    console.log(err);
    res.status(502).json({ err: "Token invalid or expired 222" });
  }
};
