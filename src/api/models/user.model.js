const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
  apikey: { type: String }
});


const User = mongoose.model("app_user", userSchema);
module.exports = User;

module.exports.getUserById = function(id, callback){
  User.findOne({id: id }, callback);
}
