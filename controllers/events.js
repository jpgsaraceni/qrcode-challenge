const fs = require('fs');

function EventList() {
  return new Promise((resolve, reject) => {
    fs.readFile('events.json', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
}

module.exports = {
  EventList,
};
