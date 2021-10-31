require('dotenv').config();
const fs = require('fs');
const nodemailer = require('nodemailer');
const templatepass = require('../templates/resetpass');

function sendEmail(email, token, browser, os, osVersion, ip) {
  return new Promise((resolve, reject) => {
    fs.readFile('clients.json', (err, data) => {
      if (err) throw err;
      const user = JSON.parse(data);

      const emailObject = user.map((element) => element.email);

      const findEmail = emailObject.indexOf(email);
      if (findEmail === -1) {
        resolve(false);
      } else {
        console.log(osVersion);
        const expire = new Date();
        expire.setHours(expire.getHours() - 2);

        user[findEmail].passwordResetToken = token;
        user[findEmail].passwordResetExpires_fulldate = expire;

        const userName = user[findEmail].name;
        const transporter = nodemailer.createTransport({
          name: 'smtp.gmail.com',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL, // your email in .env(recommended gmail)
            pass: process.env.EMAIL_PASS, // your password in .env
          },
          logger: true,
          debug: true,
        });
        const mailOptions = {
          to: `${email}`,
          subject: 'Seu código de reset do AlphaFest',
          html: templatepass.resetTemplate(
            token,
            userName,
            browser,
            os,
            osVersion,
            ip,
          ),
        };
        transporter.sendMail(mailOptions, (err2, info) => {
          if (err2) {
            reject(err2);
          } else {
            fs.writeFile('clients.json', JSON.stringify(user), (err3) => {
              if (err3) throw err;
              resolve(true); // send the email back to
              // the app.js, in order to send something to the front-end or whatever else
            });
          }
        });
      }
    });
  });
}

module.exports = {
  sendEmail,
};
