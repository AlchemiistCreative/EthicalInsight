const logs = require('../models/log.model')

module.exports.push_log = function(data){
    
    logs({
        time: new Date(),
        file: data.file,
        line: data.line,
        info: data.info,
        type: data.type
    }).save();

  }
  
module.exports.getAllLogs = function(callback){
    logs.find({}, callback);
  }

module.exports.deleteAllLogs = function(callback){
    logs.deleteMany({}, callback)
  }