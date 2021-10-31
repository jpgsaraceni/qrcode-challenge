const fs = require('fs');
const bcrypt = require('bcrypt');

function LoginUser(email, password) {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', (err, data) => {
      if (err) throw err;
      const user = JSON.parse(data);

      const emailObject = user.map((element) => element.email);

      const findEmail = emailObject.indexOf(email);

      if (findEmail !== -1) {
        if (bcrypt.compareSync(password, user[findEmail].password)) {
          resolve({
            email: user[findEmail].email,
            name: user[findEmail].name,
            type: user[findEmail].type,
            photo: user[findEmail].photo,
          }); // login ok,
          // send the data back to the app.js,
          // in order to send something to the front-end or whatever else
        } else {
          reject('1'); // incorrect password
        }
      } else {
        reject('0'); // email not found
      }
    });
  });
}

module.exports = {
  LoginUser,
};
