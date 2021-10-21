var mongoose = require('mongoose')

//if you want any field to be required to can add option required:true

const roomSchema = mongoose.Schema(
  {
    room_id: {
      type: String,
      required: true
    }

  },
  {
    timestamps: true,
  }
)

 


const room_schema = mongoose.model('Rooms', roomSchema)

module.exports = { room_schema}
