const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const rooms = {};
let time = null;

const receiveData = (req, cb) => {
  let body = '';
  req
    .on('data', chunk => {
      body += chunk;
    })
    .on('end', () => {
      body = JSON.parse(body);
      cb(body);
    });
};

const onConnection = wss => ws => {
  ws.on('message', message => {
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        time = `<sub> 
          ${new Date().toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })}
          </sub>`;
        client.send(`${ws.nickName}: ${message} ${time}`);
      }
    });
  });

  ws.on('close', () => {
    if (wss.clients && wss.clients.size === 0) {
      delete rooms[wss.roomName];
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
      res.end(`'${roomName}' room successfully created.`);
    });
  } else if (req.method === 'GET' && urlParsed.pathname === '/rooms') {
    const result = [];
    for (let i = 0; i < rooms.length; i += 1) {
      result.push(rooms[i]);
    }
    res.end(JSON.stringify(result));
  }
});

server.on('upgrade', (request, socket, head) => {
  const parsedUrl = url.parse(request.url);
  const {pathname} = parsedUrl;
  const nickname = parsedUrl.query.split('=')[1];
  if (Object.prototype.hasOwnProperty.call(rooms, 'pathname')) {
    rooms[pathname].handleUpgrade(request, socket, head, ws => {
      const client = ws;
      client.nickName = nickname;
      rooms[pathname].emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(3000);
