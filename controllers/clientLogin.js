/* eslint-disable no-param-reassign */
const fs = require('fs');
const bcrypt = require('bcrypt');

function LoginUser(email, password) {
  return new Promise((resolve, reject) => {
    fs.readFile('clients.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);
      if (received.find((element) => element.email === email)) {
        const userPassword = received.find((element) => element.email === email).password;
        const userName = received.find((element) => element.email === email).name;
        const userId = received.find((element) => element.email === email).id;
        const userType = received.find((element) => element.email === email).type;
        bcrypt.compare(password, userPassword).then((result) => {
          if (result) {
            resolve({ userName, userId, userType });
          } else {
            resolve(false);
          }
        }).catch((bcryptErr) => console.log(bcryptErr));
      } else {
        resolve(false);
      }
    });
  });
}

function SignupUser(name, email, sentPassword, telnumber) {
  return new Promise((resolve, reject) => {
    fs.readFile('clients.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);

      if (received.find((user) => user.email === email)) {
        resolve(false);
      } else {
        let id = 1;
        if (received.length > 0) {
          id = received[received.length - 1].id + 1;
        }

        bcrypt.hash(sentPassword, 10, (bcryptErr, hash) => {
          if (bcryptErr) throw bcryptErr;
          const password = hash;
          telnumber = parseInt(telnumber, 10);

          received.push({
            id,
            name,
            email,
            password,
            telnumber,
            type: 'user',
            passwordResetToken: '',
            passwordResetExpires_fulldate: '',
          });
          const updatedJSON = JSON.stringify(received);
          const stringJSON = new Uint8Array(Buffer.from(updatedJSON));

          fs.writeFile('clients.json', stringJSON, (error) => {
            if (error) {
              reject(error);
            }
            resolve(true);
          });
        });
      }
    });
  });
}

module.exports = {
  LoginUser,
  SignupUser,
};
