/* eslint-disable no-param-reassign */
const WebSocket = require('ws');
const logger = require('./logger');

const {getCurrentTime} = require('./helpers');

class Room {
  constructor(name, RoomList) {
    // RoomList reference needed only for removing this room from RoomList
    // when all clients closed the connection
    this.name = name;
    this.socket = new WebSocket.Server({noServer: true});

    this.socket.on('connection', currentClient => {
      currentClient.on('message', message => {
        this.socket.clients.forEach(client => {
          if (
            client !== currentClient &&
            client.readyState === WebSocket.OPEN
          ) {
            const msg = {
              nickname: currentClient.nickname,
              body: message,
              time: getCurrentTime(),
            };
            client.send(JSON.stringify(msg));
          }
        });
      });
      currentClient.on('close', () => {
        logger.info({
          text: `${currentClient.nickname} disconnected from ${this.name}`,
        });
        // if room is empty, remove it from RoomList
        if (this.isRoomEmpty) RoomList.removeOne(this);
      });
    });
  }

  isRoomEmpty() {
    return this.socket.clients && this.socket.clients.size === 0;
  }

  handleUpgradeRequest(request, socket, head, parsedUrl) {
    this.socket.handleUpgrade(request, socket, head, newClient => {
      const nickname =
        parsedUrl && parsedUrl.query ? parsedUrl.query.split('=')[1] : null;

      const nicknamesList = this.getClientsNicknames();
      // if this nickname already taken
      if (nicknamesList.includes(nickname)) return socket.destroy();
      // Otherwise, connect new client to room.
      newClient.nickname = nickname;
      this.socket.emit('connection', newClient, request);
    });
  }

  getClientsNicknames() {
    const nicknames = [];
    this.socket.clients.forEach(el => {
      nicknames.push(el.nickname);
    });
    return nicknames;
  }
}

module.exports = Room;
