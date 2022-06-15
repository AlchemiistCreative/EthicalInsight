const mongoose  = require('mongoose');

const Schema  = mongoose.Schema;

const logSchema = new Schema({
    time: Date,
    file: String,
    line: String,
    info: String,
    type: String

});

module.exports = mongoose.model('app_logs', logSchema);