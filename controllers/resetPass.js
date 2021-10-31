const fs = require('fs');
const bcrypt = require('bcrypt');

function resetPass(email, token, newpass) {
  return new Promise((resolve, reject) => {
    fs.readFile('clients.json', (err, data) => {
      if (err) throw err;
      const user = JSON.parse(data);

      const now = new Date();

      const emailObject = user.map((element) => element.email);

      const findEmail = emailObject.indexOf(email);

      if (findEmail === -1) {
        resolve('0'); // email not found
      } else if (user[findEmail].passwordResetToken !== token) {
        resolve('1'); // invalid token
      } else if (now.getHours() - 3 > new Date(user[findEmail].passwordResetExpires_fulldate)) {
        resolve('2'); // token expired
      } else {
        user[findEmail].password = bcrypt.hashSync(newpass, 10);
        user[findEmail].passwordResetToken = '';
        user[findEmail].passwordResetExpires_fulldate = '';

        fs.writeFile('clients.json', JSON.stringify(user), (err2) => {
          if (err2) throw err;
          resolve('3'); // success
        });
      }
    });
  });
}

module.exports = {
  resetPass,
};
