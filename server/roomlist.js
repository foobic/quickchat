const WebSocket = require('ws');

const logger = require('./logger');
const {stringifyObjectKeys} = require('./helpers');

const roomListSocket = new WebSocket.Server({noServer: true});

module.exports = rooms => {
  roomListSocket.broadcast = function broadcast(data) {
    roomListSocket.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  roomListSocket.on('connection', ws => {
    ws.send(stringifyObjectKeys(rooms));
    ws.on('close', () => {
      logger({text: 'Roomlist connection closed.'});
    });
  });

  return {roomListSocket};
};
