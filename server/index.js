'use strict';

const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const rooms = {};
let time = null;

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
  ws.on('open', () => {
    console.log('opened');
  });
  ws.on('close', () => {
    console.log('closed', wss.clients ? wss.clients.size : null);
    if (wss.clients && wss.clients.size === 0) {
      delete rooms[wss.roomName];
      console.log(`'${wss.roomName}' room deleted.`);
    }
  });
  ws.on('message', message => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        time =
            '<sub>' +
            (new Date()).toLocaleString('en-US',
              { hour: 'numeric', minute: 'numeric', hour12: true }) +
            '</sub>';
        client.send(ws.nickName + ': ' + message + ' ' + time);
      }
    });
  });

  ws.on('error', message => {
    console.log(message);
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
      wss.roomName = roomName;
      wss.on('connection', onConnection(wss));
      rooms[roomName] = wss;
      res.end(`'${roomName}' room successfully created.`);
    });
  } else   if (req.method === 'GET' && urlParsed.pathname === '/rooms') {
    const result =  [];
    for (const el in rooms) {
      result.push(el);
    }
    res.end(JSON.stringify(result));

  }
});


server.on('upgrade', (request, socket, head) => {

  const parsedUrl = url.parse(request.url);
  const pathname = parsedUrl.pathname;
  const nickname = parsedUrl.query.split('=')[1];
  if (rooms.hasOwnProperty(pathname)) {
    rooms[pathname].handleUpgrade(request, socket, head, (ws) => {
      ws.nickName = nickname;
      rooms[pathname].emit('connection', ws, request);
    });
  } else {
    console.log(pathname + ' destroyed.');
    socket.destroy();
  }
});


server.listen(3000);
