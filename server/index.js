const http = require('http');
const url = require('url');

const {receiveData, stringifyObjectKeys} = require('./helpers');
const config = require('./config.js');
const Room = require('./Room');
const RoomList = require('./RoomList');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const urlParsed = url.parse(req.url);
  if (req.method === 'POST' && urlParsed.pathname === '/create') {
    // create Room
    receiveData(req, body => {
      const roomname = `${body.name}`;
      const room = new Room(roomname, RoomList);
      RoomList.addOne(room);
      res.end(`'${roomname}' room successfully created.`);
    });
  } else if (req.method === 'GET' && urlParsed.pathname === '/getRoomList') {
    res.end(stringifyObjectKeys(RoomList.rooms));
  }
});

server.on('upgrade', (req, socket, head) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname.split('/');

  const connectTo = pathname[1];
  const roomname = pathname[2];

  if (connectTo === 'roomList') {
    RoomList.handleUpgradeRequest(req, socket, head);
  } else if (connectTo === 'room' && RoomList.isRoomExists(roomname)) {
    const room = RoomList.rooms[roomname];
    room.handleUpgradeRequest(req, socket, head, parsedUrl);
  } else {
    socket.destroy();
  }
});

// every 1m cleanup room list if needed
setTimeout(() => {
  RoomList.deleteEmptyRooms();
}, 60000);

server.listen(config.serverPort);
