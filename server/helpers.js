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

module.exports = {receiveData};
