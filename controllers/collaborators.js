const fs = require('fs');

function getcollaborators(exclude) {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', (err, data) => {
      if (err) throw err;

      const collaborators = JSON.parse(data);
      const collaboratorsFormatted = [];

      collaborators.forEach((collaborator) => {
        if (collaborator.email !== exclude) {
          collaboratorsFormatted.push(collaborator);
        }
      });

      resolve(collaboratorsFormatted);
    });
  });
}

module.exports = {
  getcollaborators,
};
