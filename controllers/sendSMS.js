/* eslint-disable new-cap */
require('dotenv').config();
const fs = require('fs');
const totalvoice = require('totalvoice-node');

const client = new totalvoice(process.env.SMS_KEY); // your key from totalvoice

function sendSms(usernumber, token) {
  return new Promise((resolve, reject) => {
    fs.readFile('clients.json', (err, data) => {
      if (err) throw err;
      const user = JSON.parse(data);

      const telnumberOject = user.map((element) => element.telnumber);

      const findTelNumber = telnumberOject.indexOf(
        parseInt(usernumber, 10),
      );

      if (findTelNumber !== -1) {
        const userResponse = false;
        const multiSMS = true;
        const createDate = '';
        const message = `${'Seu código do AlphaFest:'
                    + '\n'}${
          token
        }                                    `
                    + 'Use seu código em: '
                    + '/recover'; // sms message
        client.sms
          .enviar(
            usernumber,
            message.replace(/\|/g, '\n'),
            userResponse,
            multiSMS,
            createDate,
          )
          .then((data2) => {
            console.log(data2);
            const expire = new Date();
            expire.setHours(expire.getHours() - 2);
            console.log(expire);

            user[findTelNumber].passwordResetToken = token;
            user[findTelNumber].passwordResetExpires_fulldate = expire;

            fs.writeFile(
              'clients.json',
              JSON.stringify(user),
              (err2) => {
                if (err2) throw err;
                resolve(true); // send back to the app.js,
                // in order to send something to the front-end or whatever else
              },
            );
          })
          .catch((error) => {
            console.error('Error: ', error);
            reject(error.data.mensagem);
          });
      } else {
        resolve(false);
      }
    });
  });
}

module.exports = {
  sendSms,
};
