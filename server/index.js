'use strict';

const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const rooms = {};

const receiveData = (req, cb) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  }).on('end', () => {
    body = JSON.parse(body);
    cb(body);
  });
};

const onConnection = (wss) => (ws) => {
  console.log('connection', rooms);

  ws.on('message', message => {
    console.log('msg', message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        console.log('broadcast');
        client.send(message);
      }
    });
  });

};



const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const urlParsed = url.parse(req.url);
  if (req.method === 'POST' && urlParsed.pathname === '/create') {
    receiveData(req, (body) => {
      const roomName = '/' + body.name;
      if (roomName in rooms) {
        res.end(`'${roomName}' already exists.`);
      }
      const wss = new WebSocket.Server({ noServer: true });
      wss.on('connection', onConnection(wss));
      rooms[roomName] = wss;
      res.end(`'${roomName}' room successfully created.`);
    });
  }
});


server.on('upgrade', (request, socket, head) => {

  const pathname = url.parse(request.url).pathname;
  console.log('rooms', rooms)
  if (rooms.hasOwnProperty(pathname)) {
    // console.log(pathname + ' in socket list');
    rooms[pathname].handleUpgrade(request, socket, head, (ws) => {
      console.log();
      rooms[pathname].emit('connection', ws, request);
    });
  } else {
    console.log(pathname + ' destroyed.');
    socket.destroy();
  }
  //
  // if (pathname === '/foo') {
  //   wss1.handleUpgrade(request, socket, head, (ws) => {
  //     console.log();
  //       rooms['/foo'].emit('connection', ws, request);
  //   });
  // } else if (pathname === '/bar') {
  //   wss2.handleUpgrade(request, socket, head, (ws) => {
  //       rooms['/bar'].emit('connection', ws, request);
  //   });
  // } else {
  //   socket.destroy();
  // }
});


server.listen(3000);
