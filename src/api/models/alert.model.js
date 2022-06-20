const mongoose = require('mongoose')
const Schema = mongoose.Schema

const alertSchema = new Schema({
    AlertID: { type: Number, default: 0, required: true },
    Name: { type: String, required: true },
    Trigger: { type: String, required: true },
    Type: { type: String, required: true },
    CreatedBy: { type: String, required: false },
    
}, {timestamps: true})


const Alerts = mongoose.model('alert', alertSchema)
module.exports = Alerts
