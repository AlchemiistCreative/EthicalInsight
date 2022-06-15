//Check by headers or body

const Log = require('./log');

const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    Log.push_log({
      file: 'auth.js',
      line: '17',
      info: err,
      type: 'error'
  });

    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;