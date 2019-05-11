
# Quickchat

> Multi-room WebSocket-chat.

## Installation

```sh
npm install && 
npx lerna bootstrap
```

## Usage

Start application on `localhost:8080`
```sh 
npx pm2 start 
```

Stop application
```sh 
npx pm2 delete all 
```

If you want to see logs type following
```sh 
npx pm2 log
```

## Custom configuration
Client configuration stores in `client/env`. Server configuration stores in `server/src/config.js`. Make sure, that `VUE_APP_SERVER_PORT` variable in `client/env` and `config.serverPort` in `server/src/config.js` are equal, it is important.

## License

This project is licensed under the MIT License - see the  [LICENSE.md](https://github.com/jaspy/phostore/blob/master/LICENSE.md)  file for details

## Acknowledgments

[Favicon link](https://www.iconfinder.com/icons/1063093/chat_media_network_on_social_icon)
