//Check by cookies
const log = require('./log');
const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).redirect('/dashboard/login');
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {

    log({
      file: 'auth.js',
      line: '17',
      info: err,
      type: 'error'
  }, logs);
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;