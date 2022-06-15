//Check by cookies
const Log = require('./log');
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

    Log.push_log({
      file: 'dashboard.auth.js',
      line: '14',
      info: err,
      type: 'error'
  });
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;