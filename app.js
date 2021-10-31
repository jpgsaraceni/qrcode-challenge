const express = require('express');

const app = express();
const port = 80;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session);
const QrCode = require('qrcode-reader');
const Jimp = require('jimp');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', express.static(`${__dirname}/public`));

app.use(cookieParser());

app.use(session({
  store: new FileStore(),
  secret: 'ab6015a6ad9682c7b880cede7a8e03c7',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 172800000,
  },
}));

const path = `${__dirname}/pages/`;

// serve file routes
app.get('/', (req, res) => {
  res.sendFile(`${path}/clientLogin.html`);
});

app.get('/home', (req, res) => {
  if (!req.session || req.session.type !== 'user') {
    res.redirect('/');
  } else {
    res.sendFile(`${path}/clientHome.html`);
  }
});

app.get('/events', (req, res) => {
  if (!req.session || req.session.type !== 'user') {
    res.redirect('/');
  } else {
    res.sendFile(`${path}/myReservations.html`);
  }
});

app.get('/resetbyemail', (req, res) => {
  res.sendFile(`${path}/clientEmail.html`);
});

app.get('/resetbysms', (req, res) => {
  res.sendFile(`${path}/clientSMS.html`);
});

app.get('/recover', (req, res) => {
  res.sendFile(`${path}/recoverPass.html`);
});

app.get('/admin', (req, res) => {
  res.sendFile(`${path}/login.html`);
});

app.get('/admin/dashboard', (req, res) => {
  if (!req.session || req.session.type !== 'admin') {
    res.redirect('/admin');
  } else {
    res.sendFile(`${path}/painel.html`);
  }
});

app.get('/admin/qrcodes', (req, res) => {
  if (!req.session || req.session.type !== 'admin') {
    res.redirect('/admin');
  } else {
    res.sendFile(`${path}/allqrcodes.html`);
  }
});

app.get('/admin/events', (req, res) => {
  if (!req.session || req.session.type !== 'admin') {
    res.redirect('/admin');
  } else {
    res.sendFile(`${path}/admineventlist.html`);
  }
});

app.get('/collaborator', (req, res) => {
  res.sendFile(`${path}/fiscalLogin.html`);
});

app.get('/collaborator/home', (req, res) => {
  if (!req.session || req.session.type !== 'fiscal') {
    req.session.destroy();
    res.redirect('/collaborator');
  } else {
    res.sendFile(`${path}/fiscalHome.html`);
  }
});

const userlogin = require('./controllers/login');
const userregister = require('./controllers/register');
const deleteuser = require('./controllers/deleteUser');
const deletecollaborator = require('./controllers/deleteCollaborator');
const listusers = require('./controllers/users');
const liscollaborators = require('./controllers/collaborators');
const clientLogin = require('./controllers/clientLogin');
const fiscalLogin = require('./controllers/fiscalLogin');
const events = require('./controllers/events');
const newevent = require('./controllers/newEvent');
const newfiscal = require('./controllers/newFiscal');
const qrcode = require('./controllers/qrcode');
const viewqrcodes = require('./controllers/getQRCodes');
const contactemail = require('./controllers/sendContactMail');
const changePhoto = require('./controllers/changePhoto');
const sendEmail = require('./controllers/sendEmail');
const sendSMS = require('./controllers/sendSMS');
const reset = require('./controllers/resetPass');

app.post('/register', (req, res) => {
  const id = 1;
  const { email } = req.body;
  const { telnumber } = req.body;
  const { name } = req.body;
  const { password } = req.body;

  const register = userregister.registerUser(
    id,
    email,
    telnumber,
    name,
    password,
  );

  register
    .then((response) => {
      res.send(response);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.post('/newevent', (req, res) => {
  const { name } = req.body;
  const { description } = req.body;
  const { date } = req.body;
  const { capacity } = req.body;
  const { image } = req.body;

  if (req.session.type !== 'admin' || !req.session) {
    res.send('error: only allowed in admin dashboard');
  } else {
    const newEvent = newevent.addEvent(name, description, date, capacity, image);

    newEvent.then((response) => {
      res.send(response);
    }).catch((error) => {
      console.log(error);
      res.send(error);
    });
  }
});

app.post('/sendcontactmail', (req, res) => {
  const { mail } = req.body;
  const { subject } = req.body;
  const { msg } = req.body;
  if (!req.session) {
    res.send('error: only allowed if logged-in');
  } else {
    const newcontact = contactemail.sendContactMail(mail, msg, subject);

    newcontact.then((response) => {
      res.send(response);
    }).catch((error) => {
      console.log(error);
      res.send(error);
    });
  }
});

app.post('/newfiscal', (req, res) => {
  const { email } = req.body;
  const { telnumber } = req.body;
  const { name } = req.body;
  const { password } = req.body;
  const { photo } = req.body;
  if (req.session.type !== 'admin' || !req.session) {
    res.send('error: only allowed in admin dashboard');
  } else {
    const registerFiscal = newfiscal.newFiscal(
      name,
      email,
      telnumber,
      password,
      photo,
    );

    registerFiscal
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }
});

app.post('/loginadmin', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const login = userlogin.LoginUser(email, password);

  login
    .then((response) => {
      req.session.name = response.name;
      req.session.email = response.email;
      req.session.type = response.type;
      res.send({
        res: '2',
        type: `${response.type}`,
        photo: `${response.photo}`,
      });
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.post('/fiscalLogin', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const login = fiscalLogin.LoginUser(email, password);

  login
    .then((response) => {
      if (response) {
        req.session.name = response.name;
        req.session.email = response.email;
        req.session.type = response.type;
        res.send({
          res: '2',
          type: `${response.type}`,
          name: `${response.name}`,
        });
      } else {
        res.send(false);
      }
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.post('/validate', (req, res) => {
  if (req.session.type !== 'fiscal' || !req.session) {
    res.send('error: only allowed in fiscal dashboard');
  } else {
    const token = req.query;

    const qrcodeValidator = qrcode.getQRCode(token);

    qrcodeValidator
      .then((response) => {
        res.send(response);
      }).catch((err) => res.send(err));
  }
});

app.post('/clientLogin', (req, res) => {
  const { email } = req.body;
  const { password } = req.body;

  const login = clientLogin.LoginUser(email, password);

  login.then((response) => {
    if (response) {
      req.session.name = response.userName;
      req.session.userId = response.userId;
      req.session.type = response.userType;
      res.send(JSON.stringify({ name: response.userName, id: response.userId }));
    } else {
      res.send(false);
    }
  }).catch((err) => console.log(err));
});

app.post('/sendemail', (req, res) => {
  const token = crypto.randomBytes(20).toString('hex');
  const { email } = req.body;
  const { userBrowser } = req.body;
  const { userOS } = req.body;
  const { userOSversion } = req.body;
  const { userIP } = req.body;

  const userEmail = sendEmail.sendEmail(email, token, userBrowser, userOS, userOSversion, userIP);
  console.log(userOSversion);

  userEmail.then((response) => {
    res.send(response);
  }).catch((error) => {
    console.log(error);
    res.send(error);
  });
});

app.post('/sendsms', (req, res) => {
  const userNumber = req.body.telnumber;
  const token = Math.floor(Math.random() * 10000).toString();

  const usersms = sendSMS.sendSms(userNumber, token);

  usersms.then((response) => {
    res.send(response);
  }).catch((error) => {
    console.log(error);
    res.send(error);
  });
});

app.post('/resetpass', (req, res) => {
  const { newpass } = req.body;
  const { email } = req.body;
  const { token } = req.body;
  const resetUserPass = reset.resetPass(email, token, newpass);

  resetUserPass.then((response) => {
    res.send(response);
  }).catch((error) => {
    console.log(error);
    res.send(error);
  });
});

app.get('/clientIsLogged', (req, res) => {
  if (req.session.name && req.session.userId) res.send(true); else res.send(false);
});

app.get('/fiscalIsLogged', (req, res) => {
  if (req.session.email && req.session.type === 'fiscal') res.send(true); else res.send(false);
});

app.post('/clientSignup', (req, res) => {
  const { name } = req.body;
  const { email } = req.body;
  const { password } = req.body;
  const { telnumber } = req.body;

  const signup = clientLogin.SignupUser(name, email, password, telnumber);

  signup.then((response) => {
    if (response) {
      res.send(true);
    } else {
      res.send(false);
    }
  }).catch((err) => console.log(err));
});

app.get('/eventList', (req, res) => {
  if (!req.session) {
    res.send('error: only allowed if logged in');
  } else {
    const eventList = events.EventList();

    eventList.then((response) => {
      res.send(response);
    }).catch(() => res.send(false));
  }
});

app.post('/generateqrcode', (req, res) => {
  const { userId } = req.body;
  const { username } = req.body;
  const { eventId } = req.body;
  const { event } = req.body;
  const { eventDate } = req.body;
  const { eventImage } = req.body;
  if (!req.session) {
    res.send('error: only allowed if logged in');
  } else {
    const generateQRCode = qrcode
      .generateQRCode(userId, username, eventId, event, eventDate, eventImage);

    generateQRCode.then((response) => {
      res.send(JSON.stringify(response));
    }).catch((err) => {
      console.log(err);
      res.sendStatus(403);
    });
  }
});

app.post('/reservations', (req, res) => {
  const { userId } = req.body;
  if (!req.session) {
    res.send('error: only allowed if logged in');
  } else {
    const generateQRCode = qrcode.getReservations(userId);

    generateQRCode.then((response) => {
      res.send(JSON.stringify(response));
    }).catch((err) => {
      console.log(err);
      res.sendStatus(403);
    });
  }
});

app.get('/qrcodelist', (req, res) => {
  if (req.session.type !== 'admin' || !req.session) {
    res.send('error: only allowed in admin dashboard');
  } else {
    const qrlist = viewqrcodes.QrCodeList();

    qrlist.then((response) => {
      res.send(response);
    }).catch((error) => {
      console.log(error);
      res.send(error);
    });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid', { path: '/' }).status(200).send('Ok');
});

app.get('/getname', (req, res) => {
  if (!req.session) {
    res.send('error: only allowed if logged in');
  } else {
    const userName = req.session.name;
    res.send(userName);
  }
});

app.get('/getusers', (req, res) => {
  if (req.session.type !== 'admin' || !req.session) {
    res.send('error: only allowed in admin dashboard');
  } else {
    res.setHeader('Content-Type', 'application/json');
    const excludedUser = req.session.email;

    const userlist = listusers.getUsers(excludedUser);

    userlist
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }
});

app.get('/getcollaborators', (req, res) => {
  if (req.session.type !== 'admin' || !req.session) {
    res.send('error: only allowed in admin dashboard');
  } else {
    res.setHeader('Content-Type', 'application/json');

    const excludedUser = req.session.email;

    const collaboratorlist = liscollaborators.getcollaborators(excludedUser);

    collaboratorlist
      .then((response) => {
        res.send(response);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }
});

app.get('/isadmin', (req, res) => {
  res.setHeader('Content-Type', 'text/html');

  if (req.session.type !== 'admin' || !req.session.email) {
    res.send(false);
  } else {
    res.send(true);
  }
});

app.get('/isloggedin', (req, res) => {
  if (!req.session.type && !req.session.email) {
    res.send(false);
  } else {
    res.send(true);
  }
});

app.delete('/user', (req, res) => {
  const { id } = req.query;
  if (req.session.type !== 'admin' || !req.session) {
    res.send('error: only allowed in admin dashboard');
  } else {
    const deleteUser = deleteuser.deleteUser(id);

    if (req.session.type === 'admin') {
      deleteUser
        .then((response) => {
          res.send(response);
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    }
  }
});

app.delete('/collaborator', (req, res) => {
  const { id } = req.query;
  if (req.session.type !== 'admin' || !req.session) {
    res.send('error: only allowed in admin dashboard');
  } else {
    const deleteCollaborator = deletecollaborator.deleteCollaborator(id);

    if (req.session.type === 'admin') {
      deleteCollaborator
        .then((response) => {
          res.send(response);
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    }
  }
});

app.post('/receiveqrcode', (req, res) => {
  const { archive } = req.body;
  if (req.session.type !== 'fiscal' || !req.session) {
    res.send('error: only allowed in fiscal dashboard');
  } else {
    Jimp.read(Buffer.from(archive.replace(/^data:image\/png;base64,/, ''), 'base64'), (err, image) => {
      if (err) {
        console.error(err);
      }
      const qr = new QrCode();
      qr.callback = (erra, value) => {
        if (erra) {
          console.error(erra);
          res.send(false);
        } else {
          res.send(value.result);
        }
      };
      qr.decode(image.bitmap);
    });
  }
});

app.post('/checkUsed', (req, res) => {
  const { token } = req.body;
  if (req.session.type !== 'fiscal' || !req.session) {
    res.send('error: only allowed in fiscal dashboard');
  } else {
    const validate = qrcode.validate(token);

    validate
      .then((response) => res.send(response)).catch((e) => res.send(e));
  }
});

app.post('/changephoto', (req, res) => {
  if (!req.session) {
    res.send('error: only allowed if logged in');
  } else {
    const { imageurl } = req.body;
    const userEmail = req.session.email;

    const userPhoto = changePhoto.ChangeUserPhoto(userEmail, imageurl);

    userPhoto.then((response) => {
      res.send(response);
    }).catch((error) => {
      console.log(error);
      res.send(error);
    });
  }
});

app.delete('/cancelreservation', (req, res) => {
  const { token } = req.body;

  const cancel = qrcode.cancelReservation(token);

  cancel.then(((response) => {
    if (response) {
      res.send(true);
    } else {
      res.send(false);
    }
  })).catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
