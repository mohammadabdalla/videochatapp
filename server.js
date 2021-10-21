const express = require('express')
const app = express()
const path = require('path')
const dotenv = require('dotenv').config();
var connectMongoSites = require('./mongo/config')
connectMongoSites()

var mongoMethods = require('./mongo/controller')
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json())

 
app.get('/leave', (req, res) => {
  res.render('error' , {content: 'You have left the chat!'})
}) 

app.get('/joinRoom', (req, res) => {
  res.render('joinRoom')
}) 

app.get('/rooms/:room', async(req, res ) => {
  var data = await mongoMethods.find_data(req.params.room)
  if(data.length > 0){
    res.render('room', { roomId: req.params.room })

  }else{
   res.render('error' , {content: `Sorry, the room you are looking for doesn't exist!`})
  }
 
})

app.get('*', async(req, res ) => {
  res.render('pageNotFound')
})


app.post('/createRoom', async(req, res ) => {
    
    if(req.body.room_id){
      var data = await mongoMethods.insert_data(req.body.room_id)
      res.status(200).json(data)
    }else{
      res.status(400)
      throw new Error('An error occurred!')
    }
})
 



io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  })

  
})


server.listen(process.env.PORT ||3000)