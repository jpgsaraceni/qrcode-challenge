const fs = require('fs');

function deleteCollaborator(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', (err, data) => {
      if (err) throw err;

      const users = JSON.parse(data);

      const userObject = users.map((element) => element.id);

      const findUser = userObject.indexOf(parseInt(id, 10));

      users.forEach((user) => {
        if (user.id === parseInt(id, 10)) {
          users.splice(findUser, 1);
        }
      });

      fs.writeFile('users.json', JSON.stringify(users), (err2) => {
        if (err2) throw err2;
        resolve(true);
      });
    });
  });
}

module.exports = {
  deleteCollaborator,
};
