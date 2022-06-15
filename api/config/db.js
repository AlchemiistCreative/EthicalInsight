//
// DB config
//
const mongoose = require('mongoose')
const source = process.env.MONGODB_URL

mongoose.connect(source, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const Connection = mongoose.connection
module.exports = Connection;