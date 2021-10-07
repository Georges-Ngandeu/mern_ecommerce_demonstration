const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({
    path: 'backend/config.env'
})

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(con => {
        console.log(`MongoDb Database connected with host ${con.connection.host}`)
    }).catch(err => console.log(err))
}

module.exports = connectDatabase