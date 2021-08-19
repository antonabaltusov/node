const io = require('socket.io');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
          
      const filePath = path.join(__dirname, 'index.html');
  
      readStream = fs.createReadStream(filePath);

      readStream.pipe(response);
    } 
  });

const newId = () => {
    let id = ''
    let goodId = false;
    while (!goodId) {
        for (let i = 0; i < 4; i++) {
            a = Math.floor(Math.random() * 10).toString(); 
            id = id + a;
            console.log(id);
        };
        if (clients.indexOf(id)===-1)goodId=true;
    }
    return id
};

const socket = io(app);
 const clients = []

socket.on('connection', function (client) {
  const clientId = newId();
  clients.push(clientId);
  console.log(`New connection ${clientId}`);

  console.log(clients);

  client.broadcast.emit('NEW_CONN_EVENT', { msg: `The new client  ${clientId} connected` });

  client.on('CLIENT_MSG', (data) => {
    let message = data.msg;
    client.broadcast.emit('SERVER_MSG', { msg: `client ${clientId}: ${message}`});
  });

  client.on('disconnect', () => {
      console.log(`client ${clientId} disconnected`);
      clients.splice(clients.indexOf(clientId),1);
      client.broadcast.emit('NEW_CONN_EVENT', { msg: `client ${clientId} disconnected` });
  })
});

app.listen(3000, 'localhost');