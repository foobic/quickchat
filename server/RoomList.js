const WebSocket = require('ws');

const logger = require('./logger');
const {stringifyObjectKeys} = require('./helpers');

class RoomList {
  constructor() {
    this.rooms = {}; // 'roomname' : Room Object
    this.socket = new WebSocket.Server({noServer: true});

    this.socket.broadcast = data => {
      this.socket.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) client.send(data);
      });
    };

    this.socket.on('connection', roomlistSocket => {
      roomlistSocket.send(stringifyObjectKeys(this.rooms));
      roomlistSocket.on('close', () => {
        logger.info({text: 'Roomlist connection closed.'});
      });
    });
  }

  isRoomExists(pathname) {
    return Object.prototype.hasOwnProperty.call(this.rooms, pathname);
  }

  addOne(room) {
    this.rooms[room.name] = room;
    logger.info({text: `Room ${room.name} created.`});
    this.broadcastNewRoomlist();
  }

  removeOne(room) {
    delete this.rooms[room.name];
    logger.info({text: `Room ${room.name} removed.`});
    this.broadcastNewRoomlist();
  }

  broadcastNewRoomlist() {
    this.socket.broadcast(stringifyObjectKeys(this.rooms));
  }

  handleUpgradeRequest(request, socket, head) {
    this.socket.handleUpgrade(request, socket, head, ws => {
      this.socket.emit('connection', ws, request);
    });
  }

  deleteEmptyRooms() {
    // find rooms with zero clients quantity
    const emptyRooms = [];
    Object.keys(this.rooms).forEach(name => {
      if (this.rooms[name].isRoomEmpty()) emptyRooms.push(this.rooms[name]);
    });

    // remove these empty rooms from roomList
    if (emptyRooms.length > 0) {
      emptyRooms.forEach(room => {
        logger.info({text: `Room ${room.name} deleted.`});
        this.removeOne(room);
      });
      // after removing send to active clients new roomList
      this.broadcastNewRoomlist();
    }
  }
}

module.exports = new RoomList();
