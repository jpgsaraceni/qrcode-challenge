const fs = require('fs');

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    fs.readFile('clients.json', (err, data) => {
      if (err) throw err;

      const clients = JSON.parse(data);

      const clientObject = clients.map((element) => element.id);

      const findClient = clientObject.indexOf(parseInt(id, 10));

      clients.forEach((user) => {
        if (user.id === parseInt(id, 10)) {
          clients.splice(findClient, 1);
        }
      });

      fs.writeFile('clients.json', JSON.stringify(clients), (err2) => {
        if (err2) throw err2;
        resolve(true);
      });
    });
  });
}

module.exports = {
  deleteUser,
};
