const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const {receiveData} = require('./helpers');
const logger = require('./logger');

const rooms = {};
const roomListSocket = new WebSocket.Server({noServer: true});
let msg = null;

function getNicknames(set) {
  const list = [];
  set.forEach(el => {
    list.push(el.nickname);
  });
  return list;
}

roomListSocket.broadcast = function broadcast(data) {
  roomListSocket.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

roomListSocket.on('connection', ws => {
  ws.send(JSON.stringify(Object.keys(rooms)));
  ws.on('close', () => {
    logger({text: 'Roomlist connection closed.'});
  });
});

const onConnection = wss => ws => {
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

  console.log(getNicknames(wss.clients));

  ws.on('close', () => {
    if (wss.clients && wss.clients.size === 0) {
      logger({text: `Room ${wss.roomName} deleted.`});
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
  } else if (req.method === 'GET' && urlParsed.pathname === '/getRoomList') {
    res.end(JSON.stringify(Object.keys(rooms)));
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
      const nicknameList = getNicknames(rooms[pathname].clients);
      if (nicknameList.includes(nickname)) {
        return socket.destroy();
      }

      const client = ws;
      client.nickname = nickname;
      // rooms[pathname].clients.map(el => {
      //   console.log(el.nickname);
      //   return el;
      // });
      console.log();
      rooms[pathname].emit('connection', client, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(3000);
