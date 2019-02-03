const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const rooms = {};
const roomListSocket = new WebSocket.Server({noServer: true});
const {receiveData} = require('./helpers');
const logger = require('./logger');

roomListSocket.broadcast = function broadcast(data) {
  roomListSocket.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

roomListSocket.on('connection', ws => {
  ws.on('close', () => {
    console.log('Roomlist connection closed.');
    // roomListSocket.clients
    console.log(roomListSocket.clients.size);
  });
  // console.log();
  // ws.send(JSON.stringify(Object.keys(rooms)));
});

let msg = null;

const onConnection = wss => ws => {
  ws.on('open', param => {
    console.log('opened');
  });

  ws.on('message', message => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        msg = {
          nickname: ws.nickname,
          body: message,
          time: new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }),
        };
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on('close', () => {
    if (wss.clients && wss.clients.size === 0) {
      logger({msg: `Room ${wss.roomName} deleted.`});
      delete rooms[wss.roomName];
      roomListSocket.broadcast(Object.keys(rooms));
    }
  });
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const urlParsed = url.parse(req.url);
  if (req.method === 'POST' && urlParsed.pathname === '/create') {
    receiveData(req, body => {
      const roomName = `/${body.name}`;
      if (roomName in rooms) {
        res.end(`'${roomName}' already exists.`);
      }
      const wss = new WebSocket.Server({noServer: true});
      wss.roomName = roomName;
      rooms[roomName] = wss;
      wss.on('connection', onConnection(wss));
      roomListSocket.broadcast(Object.keys(rooms));
      res.end(`'${roomName}' room successfully created.`);
    });
  }
});

server.on('upgrade', (request, socket, head) => {
  const parsedUrl = url.parse(request.url);
  const {pathname} = parsedUrl;
  const nickname =
    parsedUrl && parsedUrl.query ? parsedUrl.query.split('=')[1] : null;

  if (pathname === '/roomList') {
    roomListSocket.handleUpgrade(request, socket, head, ws => {
      roomListSocket.emit('connection', ws, request);
    });
  } else if (Object.prototype.hasOwnProperty.call(rooms, pathname)) {
    rooms[pathname].handleUpgrade(request, socket, head, ws => {
      const client = ws;
      client.nickname = nickname;
      rooms[pathname].emit('connection', client, request);
    });
  } else {
    console.log(pathname, ' destroyed');
    socket.destroy();
  }
});

server.listen(3000);
