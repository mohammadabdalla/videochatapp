var  mongoose = require('mongoose')

module.exports = connectMongoSites = async () => {
  try {
    const conn = await mongoose.connect(process.env.mongo_rooms_url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //useCreateIndex: true,
    })

    console.log('MongoDB Connected')
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
