const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    ObjectGUID: { type: String, required: true },
    Domain: {type: String, required: true},
    SAMAccountName: { type: String, required: true },
    DisplayName: { type: String, required: false },
    UserPrincipalName: { type: String, required: false },
    whenchanged: { type: String, required: true },
    whencreated: { type: String, required: true },
    PasswordLastSet: { type: String, required: false },
    Enabled: { type: Boolean, required: false}
    
}, {timestamps: true})


const AuditedUser = mongoose.model('audit_user_data_history', userSchema)
module.exports = AuditedUser
