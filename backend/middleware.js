const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const auhtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(404).json({});
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  try {
    console.log(token, JWT_SECRET);

    const decode = jwt.verify(token, JWT_SECRET);
    console.log("decode", decode);
    if (decode.userId) {
      req.userId = decode.userId;
      next();
    } else {
      return res.status(403).json({});
    }
  } catch (err) {
    return res.status(403).json({});
  }
};
module.exports = {
  auhtMiddleware,
};
