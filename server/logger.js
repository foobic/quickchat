/* eslint-disable no-console */
module.exports = {
  info: msg => {
    console.info(msg.text);
  },
  warn: msg => {
    console.warn(msg.text);
  },
  err: msg => {
    console.error(msg.text);
  },
};
