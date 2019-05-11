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

const stringifyObjectKeys = object => JSON.stringify(Object.keys(object));

const getCurrentTime = () =>
  new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

module.exports = {
  receiveData,
  stringifyObjectKeys,
  getCurrentTime,
};
