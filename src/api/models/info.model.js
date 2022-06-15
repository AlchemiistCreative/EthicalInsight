const mongoose = require('mongoose')
const Schema = mongoose.Schema

const infoSchema = new Schema({
    ID: { type: String, required: true},
    OSVersion: { type: String, required: true },
    Domain: { type: String, required: false },
    Forest: { type: String, required: false },
    Site: { type: String, required: true },
    Hostname: { type: String, required: true },
    ProductName: { type: String, required: true },
    IPaddress: [{ type: String }],
    last_run: {type: String, required: true}
})


const Info = mongoose.model('client_info', infoSchema)
module.exports = Info

module.exports.getInfoByName = function(name, callback){
    Info.findOne({Domain: name }, callback);
  }
