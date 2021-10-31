const fs = require('fs');
const bcrypt = require('bcrypt');

function newFiscal(name, email, telnumber, pass, photo) {
  return new Promise((resolve, reject) => {
    let id = 1;
    fs.readFile('users.json', (err, data) => {
      if (err) throw err;

      const users = JSON.parse(data);

      if (users.length > 0) {
        id = users[users.length - 1].id + 1;
      }

      const userObject = users.map((element) => element.email);

      const userTelNumber = users.map((element) => element.telnumber);

      const findUser = userObject.indexOf(email);
      const findTelNumber = userTelNumber.indexOf(parseInt(telnumber, 10));

      if (findUser !== -1 || findTelNumber !== -1) {
        reject(false);
      } else {
        const tempFiscal = {};

        tempFiscal.id = parseInt(id, 10);
        tempFiscal.name = name;
        tempFiscal.email = email;
        tempFiscal.telnumber = telnumber;
        tempFiscal.pass = bcrypt.hashSync(pass, 10);
        tempFiscal.type = 'fiscal';
        tempFiscal.photo = photo;

        users.push(tempFiscal);

        fs.writeFile('users.json', JSON.stringify(users), (err2) => {
          if (err2) throw err2;
          resolve(true); // send true back to the app.js,
          // in order to send something to the front-end or whatever else
        });
      }
    });
  });
}

module.exports = {
  newFiscal,
};
