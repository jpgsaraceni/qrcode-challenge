const fs = require('fs');

function getUsers(exclude) {
  return new Promise((resolve, reject) => {
    fs.readFile('clients.json', (err, data) => {
      if (err) throw err;

      const users = JSON.parse(data);
      const usersFormatted = [];

      users.forEach((user) => {
        if (user.email !== exclude) {
          usersFormatted.push(user);
        }
      });

      resolve(usersFormatted);
    });
  });
}

module.exports = {
  getUsers,
};
