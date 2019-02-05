const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const rooms = {}; // '/roomname' : WS

const {
  receiveData,
  getNicknames,
  stringifyObjectKeys,
  getCurrentTime,
} = require('./helpers');
const logger = require('./logger.js');
const {roomListSocket} = require('./roomlist.js')(rooms);

const notifyRoomListUpdated = () =>
  roomListSocket.broadcast(stringifyObjectKeys(rooms));

const checkRoomIsAlive = () => {
  const deletionList = [];
  Object.keys(rooms).forEach(el => {
    if (rooms[el].clients && rooms[el].clients.size === 0) {
      deletionList.push(rooms[el].roomname);
    }
  });
  deletionList.forEach(el => {
    logger({text: `Room ${el} deleted.`});
    delete rooms[el];
  });
  if (deletionList.length > 0) {
    notifyRoomListUpdated();
  }
};

const onRoomConnection = wss => ws => {
  ws.on('message', message => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        const msg = {
          nickname: ws.nickname,
          body: message,
          time: getCurrentTime(),
        };
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on('close', () => {
    if (wss.clients && wss.clients.size === 0) {
      delete rooms[wss.roomname];
      logger({text: `Room ${wss.roomname} deleted.`});
      notifyRoomListUpdated();
    }
  });
};

// every 1m cleanup room list if needed
setTimeout(() => {
  checkRoomIsAlive();
}, 60000);

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const urlParsed = url.parse(req.url);
  if (req.method === 'POST' && urlParsed.pathname === '/create') {
    receiveData(req, body => {
      const roomname = `/${body.name}`;
      const wss = new WebSocket.Server({noServer: true});
      wss.roomname = roomname;
      rooms[roomname] = wss;
      wss.on('connection', onRoomConnection(wss));
      notifyRoomListUpdated();
      logger({text: `'${roomname}' room successfully created.`});
      res.end(`'${roomname}' room successfully created.`);
    });
  } else if (req.method === 'GET' && urlParsed.pathname === '/getRoomList') {
    res.end(stringifyObjectKeys(rooms));
  }
});

server.on('upgrade', (request, socket, head) => {
  const parsedUrl = url.parse(request.url);
  const {pathname} = parsedUrl;

  if (pathname === '/roomList') {
    roomListSocket.handleUpgrade(request, socket, head, ws => {
      roomListSocket.emit('connection', ws, request);
    });
  } else if (Object.prototype.hasOwnProperty.call(rooms, pathname)) {
    rooms[pathname].handleUpgrade(request, socket, head, ws => {
      const nickname =
        parsedUrl && parsedUrl.query ? parsedUrl.query.split('=')[1] : null;
      const nicknameList = getNicknames(rooms[pathname].clients);
      if (nicknameList.includes(nickname)) {
        // if this nickname already taken
        return socket.destroy();
      }
      const client = ws;
      client.nickname = nickname;
      rooms[pathname].emit('connection', client, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(3000);
