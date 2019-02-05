# quickchat

> Multi-room WebSocket-chat.

## Requirements
- [pm2](https://github.com/Unitech/pm2) globally

## Installation

```sh
npm install --prefix client/
npm install --prefix server/
```

## Usage

```sh
pm2 start && pm2 log 
```
After, check `localhost:8080`

## Custom configuraion
Client configuration stores in `client/env`. Server configuration stores in `server/config.js`. Make sure, that `VUE_APP_SERVER_PORT` variable in `client/env` and `config.serverPort` in `server/config.js` are equal, it is important.

## License
[Favicon link](https://www.iconfinder.com/icons/1063093/chat_media_network_on_social_icon)

MIT © [Alex Gorbov]
