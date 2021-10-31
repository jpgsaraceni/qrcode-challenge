const fs = require('fs');
const bcrypt = require('bcrypt');

function LoginUser(email, password) {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', (err, data) => {
      if (err) reject(err);

      const received = JSON.parse(data);

      if (received.find((element) => element.email === email)) {
        const userPassword = received.find((element) => element.email === email).password;
        const userName = received.find((element) => element.email === email).name;
        const userType = received.find((element) => element.email === email).type;

        bcrypt.compare(password, userPassword).then((result) => {
          if (result) {
            resolve({ name: userName, type: userType, email });
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

module.exports = {
  LoginUser,
};
