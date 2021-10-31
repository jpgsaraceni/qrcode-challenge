const fs = require('fs');
const crypto = require('crypto');

function generateQRCode(userId, username, eventId, event, eventDate, eventImage) {
  return new Promise((resolve, reject) => {
    const owner = username;

    fs.readFile('events.json', (err2, data2) => {
      if (err2) console.log(err2);

      const receivedEvents = JSON.parse(data2);

      receivedEvents.forEach((listedEvent, i) => {
        if (listedEvent.id === eventId) {
          receivedEvents[i].reservations += 1;
        }
        const updatedEventJSON = JSON.stringify(receivedEvents);
        const stringEventJSON = new Uint8Array(Buffer.from(updatedEventJSON));

        fs.writeFile('events.json', stringEventJSON, (error3) => {
          if (error3) {
            reject(error3);
          }
        });
      });
    });

    fs.readFile('qrcodes.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);

      if (received.find((token) => token.user_id === userId && token.event_id === eventId)) {
        resolve(false);
      } else {
        let id = 1;
        if (received.length > 0) {
          id = received[received.length - 1].id + 1;
        }
        const token = crypto
          .createHash('sha256')
          .update(`${new Date().getTime() + userId + eventId}`)
          .digest('hex');

        received.push({
          id,
          token,
          owner,
          user_id: userId,
          event,
          event_id: eventId,
          created_date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
          event_date: eventDate,
          event_image: eventImage,
          used: false,
        });

        const updatedJSON = JSON.stringify(received);
        const stringJSON = new Uint8Array(Buffer.from(updatedJSON));

        fs.writeFile('qrcodes.json', stringJSON, (error) => {
          if (error) {
            reject(error);
          }
          resolve(token);
        });
      }
    });
  });
}

function getReservations(userId) {
  return new Promise((resolve, reject) => {
    fs.readFile('qrcodes.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);
      const resObject = [];

      received.forEach((qrcodes) => {
        if (qrcodes.user_id === userId) resObject.push(qrcodes);
      });
      resolve(resObject);
    });
  });
}

function getQRCode({ token }) {
  return new Promise((resolve, reject) => {
    fs.readFile('qrcodes.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);
      const resObject = [];

      received.forEach((qrcodes) => {
        if (qrcodes.token === token) resObject.push(qrcodes);
      });
      if (resObject.length < 1 || resObject[0].used) {
        reject(false);
      } else {
        resolve(resObject[0]);
      }
    });
  });
}

/* OLD
function validate(token) {
  return new Promise((resolve, reject) => {
    fs.readFile('qrcodes.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);

      received.forEach((qrcodes, i) => {
        if (qrcodes.token === token) {
          received[i].used = true;
          console.log(received[i]);
        }
        const updatedJSON = JSON.stringify(received);
        const stringJSON = new Uint8Array(Buffer.from(updatedJSON));

        fs.writeFile('qrcodes.json', stringJSON, (error) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        });
      });
    });
  });
}
*/

function validate(token) {
  return new Promise((resolve, reject) => {
    fs.readFile('qrcodes.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);

      const receivedObject = received.map((element) => element.token);
      // map only the token from the qrcodes.json

      const findreceived = receivedObject.indexOf(token);
      // find the position of the token in qrcodes.json

      if (findreceived !== -1) { // if found
        received[findreceived].used = true;
        fs.writeFile('qrcodes.json', JSON.stringify(received), (error) => {
          if (error) {
            reject(error);
          }
          resolve(true);
        });
      } else {
        reject('error');
        console.log('qr code not found');
      }
    });
  });
}

function cancelReservation(token) {
  return new Promise((resolve, reject) => {
    fs.readFile('qrcodes.json', (err, data) => {
      if (err) reject(err);

      let eventId;
      const received = JSON.parse(data);
      const resObject = [...received];

      received.forEach((qrcodes, i) => {
        if (qrcodes.token === token) {
          eventId = resObject[i].event_id;
          resObject.splice(i, 1);
        }
      });

      if (!eventId) {
        reject(false);
      }

      const updatedJSON = JSON.stringify(resObject);
      const stringJSON = new Uint8Array(Buffer.from(updatedJSON));

      fs.writeFile('qrcodes.json', stringJSON, (error) => {
        if (error) reject(error);

        fs.readFile('events.json', (err2, data2) => {
          if (err2) console.log(err2);

          const receivedEvents = JSON.parse(data2);

          receivedEvents.forEach((listedEvent, i) => {
            if (listedEvent.id === eventId) {
              receivedEvents[i].reservations -= 1;
            }
            const updatedEventJSON = JSON.stringify(receivedEvents);
            const stringEventJSON = new Uint8Array(Buffer.from(updatedEventJSON));

            fs.writeFile('events.json', stringEventJSON, (error3) => {
              if (error3) {
                reject(error3);
              }
            });
          });
        });
        resolve(true);
      });
    });
  });
}

module.exports = {
  generateQRCode,
  getReservations,
  getQRCode,
  validate,
  cancelReservation,
};
