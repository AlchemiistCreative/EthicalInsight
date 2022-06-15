const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
    EventID: { type: String, required: true },
    Domain: {type: String, required: true},
    DisplayName: {type: String, required: false},
    MachineName: { type: String, required: true },
    TimeCreated: { type: String, required: true },
    Action: { type: String, required: true },
    Subject_AccountName: { type: String, required: true },
    Subject_DomainName: { type: String, required: true },
    Target_AccountName: { type: String, required: true },
    Target_DomainName: { type: String, required: true },
    TaskDisplayName: { type: String, required: false },
    RecordID: { type: String, required: true },
    
}, {timestamps: true})


const AuditedUser = mongoose.model('audit_events_history', eventSchema)
module.exports = AuditedUser
