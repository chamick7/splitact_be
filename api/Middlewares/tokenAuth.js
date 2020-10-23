const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const decode = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.accountData = decode;

    next();
  } catch (error) {
      res.status(401).json({
          status: "Error",
          code: "AC0031"
      })
  }
};
