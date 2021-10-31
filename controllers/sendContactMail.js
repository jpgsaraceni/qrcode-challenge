require('dotenv').config();
const nodemailer = require('nodemailer');
const contactTemplate = require('../templates/contactEmail');

function sendContactMail(useremail, usermsg, subject) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      name: 'smtp.gmail.com',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'alphafestprovider@gmail.com',
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true,
    });
    const mailOptions = {
      to: 'alphafesthelp@gmail.com',
      subject: `Contato de ${useremail} - ${subject}`,
      html: contactTemplate.contactEmailTemplate(useremail, usermsg),
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

module.exports = {
  sendContactMail,
};
