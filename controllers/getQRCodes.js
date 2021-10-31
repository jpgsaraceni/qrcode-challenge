const fs = require('fs');

function QrCodeList() {
  return new Promise((resolve, reject) => {
    fs.readFile('qrcodes.json', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

module.exports = {
  QrCodeList,
};
