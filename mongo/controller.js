var mongoose = require('mongoose')
var dotenv = require('dotenv')
var models = require('./models')
var connectMongoSites = require('./config')

dotenv.config()

const insert_data = async (roomId)=>{
    try {
        if(mongoose.connection.readyState == 0){
            await connectMongoSites()
        }
        var data  = await  models.room_schema.insertMany({
            room_id:roomId
        })
        console.log('Data !',data)
         return data
    } catch (error) {
        console.error(`${error}`)
    }
}

const find_data = async (roomId)=>{
    try {
        if(mongoose.connection.readyState == 0){
            await connectMongoSites()
        }
        var data  = await  models.room_schema.find({
            room_id:roomId
        })
        return data
    } catch (error) {
        console.error(`${error}`)
    }
}
//insert_data()
//find_data('test test test test')

module.exports = { find_data , insert_data}