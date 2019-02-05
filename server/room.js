/* eslint-disable no-param-reassign */
const WebSocket = require('ws');
const logger = require('./logger');

const {getCurrentTime} = require('./helpers');

module.exports = (rooms, notifyRoomListUpdated) => {
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
  return {checkRoomIsAlive, onRoomConnection};
};
