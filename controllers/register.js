const fs = require('fs');
const bcrypt = require('bcrypt');

function registerUser(email, telnumber, name, password, photo) {
  return new Promise((resolve, reject) => {
    let id = 1;
    fs.readFile('users.json', (err, data) => {
      if (err) throw err;

      const user = JSON.parse(data);

      if (user.length > 0) {
        id = user[user.length - 1].id + 1;
      }

      const userObject = user.map((element) => element.email);

      const userTelnumber = user.map((element) => element.telnumber);

      const findUser = userObject.indexOf(email);
      const findTelnumber = userTelnumber.indexOf(parseInt(telnumber, 10));

      if (findUser !== -1 || findTelnumber !== -1) {
        reject(err); // email or telnumber already exists
      } else {
        const tempUser = {};

        tempUser.id = parseInt(id, 10);
        tempUser.name = name;
        tempUser.email = email;
        tempUser.telnumber = parseInt(telnumber, 10);
        tempUser.password = bcrypt.hashSync(password, 10);
        tempUser.type = 'user';
        tempUser.photo = photo || '';

        user.push(tempUser);

        fs.writeFile('users.json', JSON.stringify(user), (error) => {
          if (error) throw error;
          resolve(true); // send true back to the app.js,
          // in order to send something to the front-end or whatever else
        });
      }
    });
  });
}

module.exports = {
  registerUser,
};
