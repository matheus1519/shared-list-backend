const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const routes = require('./routes')

const app = express();
// const server = require('http').Server(app);

const https = require('https')
const sslServer = https.createServer({
 key: fs.readFileSync(path.join(__dirname, '..', 'cert','key.pem')),
 cert: fs.readFileSync(path.join( __dirname,'..', 'cert','cert.pem')),
}, app)

const io = require('socket.io')(sslServer, { 
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  // console.log(user);

  connectedUsers[user] = socket.id;
});

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

sslServer.listen(process.env.PORT || 3443);