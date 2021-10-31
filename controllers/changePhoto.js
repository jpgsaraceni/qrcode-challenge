const fs = require('fs');

function ChangeUserPhoto(email, url) {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', (err, data) => {
      if (err) throw err;
      const user = JSON.parse(data);

      const emailObject = user.map((element) => element.email);

      const findEmail = emailObject.indexOf(email);

      if (findEmail !== -1) {
        user[findEmail].photo = url;
        fs.writeFile('users.json', JSON.stringify(user), (error) => {
          if (error) throw error;
          resolve(true); // send true back to the app.js,
          // in order to send something to the front-end or whatever else
        });
      } else {
        reject(false); // email not found
      }
    });
  });
}

module.exports = {
  ChangeUserPhoto,
};
