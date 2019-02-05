const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const rooms = {}; // '/roomname' : WS

const {receiveData, getNicknames, stringifyObjectKeys} = require('./helpers');
const logger = require('./logger.js');
const {roomListSocket} = require('./roomlist.js')(rooms);

const notifyRoomListUpdated = () =>
  roomListSocket.broadcast(stringifyObjectKeys(rooms));

  
const {checkRoomIsAlive, onRoomConnection} = require('./room.js')(
  rooms,
  notifyRoomListUpdated,
)


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

// every 1m cleanup room list if needed
setTimeout(() => {
  checkRoomIsAlive();
}, 60000);

server.listen(3000);
