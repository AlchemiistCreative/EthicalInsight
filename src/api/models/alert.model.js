const mongoose = require('mongoose')
const Schema = mongoose.Schema

const alertSchema = new Schema({
    AlertID: { type: String, default: 0, required: true },
    Name: { type: String, required: true },
    To: { type: String, required: true },
    From: { type: String, required: true },
    Type: { type: String, required: true },
    Trigger: { type: String, required: true },
    
}, {timestamps: true})


const Alerts = mongoose.model('alert', alertSchema)
module.exports = Alerts
