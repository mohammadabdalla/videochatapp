const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})
const { v4: uuidV4 } = require('uuid')


app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/disconnect', (req, res) => {
  console.log('from inside the disconnect method')
  
  res.json()
  //socket.disconnect()
}) 


app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

var current_room_id
app.get('/:room', (req, res) => {
  //current_room_id = req.params.room
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    current_room_id = roomId
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message);
    });
  })

  
socket.on('leave-call',()=>{ 
  console.log('reached the leave call' , current_room_id)
 socket.leave(current_room_id)
})
})
 


server.listen(process.env.PORT ||3000)