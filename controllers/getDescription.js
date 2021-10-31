const fs = require('fs');

function eventDescription(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('events.json', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const findDescription = data.find((element) => element.id === id);
        resolve(findDescription.description);
      }
    });
  });
}

module.exports = {
  eventDescription,
};
