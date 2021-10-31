const fs = require('fs');

function addEvent(name, description, date, capacity, image) {
  return new Promise((resolve, reject) => {
    let id = 1;
    fs.readFile('events.json', (err, data) => {
      if (err) throw err;

      const events = JSON.parse(data);

      if (events.length > 0) {
        id = events[events.length - 1].id + 1;
      }

      const tempEvent = {};

      tempEvent.id = parseInt(id, 10);
      tempEvent.name = name;
      tempEvent.description = description;
      tempEvent.date = date;
      tempEvent.capacity = parseInt(capacity, 10);
      tempEvent.reservations = 0;
      tempEvent.image = image;

      events.push(tempEvent);

      fs.writeFile('events.json', JSON.stringify(events), (err2) => {
        if (err2) throw err2;
        resolve(true); // send true back to the app.js,
        // in order to send something to the front-end or whatever else
      });
    });
  });
}

module.exports = {
  addEvent,
};
