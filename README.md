# Fourth code challenge - Eniac I Alpha EdTech

## Run this app

You will need [Node.js](https://nodejs.org/en/) installed on your machine.

1. Install dependencies

```shell
npm install
```

2. Run server

```shell
npm run build
```

3. Access the site on:

##### `http://localhost:80` to make reservations for events and generate QR Codes.

```markdown
Login
**email**: user@test.test
**password**: 123456
```

##### `http://localhost:80/collaborator` to read and validate QR Codes

```markdown
Login
**email**: collaborator@test.test
**password**: 123456
```

##### `http://localhost:80/admin` to view all generated QR Codes, add events and register collaborators

```markdown
Login
**email**: admin@test.test
**password**: 123456
```

### The challenge

Develop a booking service for an event of our choice, in which a client generates a QR Code with the information for his reservation which an employee from the event would read at the event entrance.

### Requirements (assigned by the instructor)

- Express server
- Session management by cookies
- Single use QR Code with reservation info
- Authenticated access to QR Code invalidation

### Future improvements and bug fixes

1. Refactor the server side (currently one big app.js file with some controllers);
2. Improve interfaces;
3. Session management package (problems with /sessions directory);
4. Rewrite as SPA;
5. API documentation;
6. Connect to DB (currently using Node File System to read and write on json files);

### .env

In order to use email and sms password recovery, you must set the following environment variables:

```text
EMAIL=
EMAIL_PASS=
SMS_KEY=
```

EMAIL and EMAIL_PASS are email and password to an existing account (gmail is recommended).
SMS_KEY is the key to [totalvoice](https://totalvoice.github.io/totalvoice-docs/#bibliotecas)
