function contactEmailTemplate(useremail, usermsg) {
  return `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
  <style>
    .msg-flex {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
    }
  </style>
</head>

<body>
  <h1>Contato de ${useremail}</h1>
  <div class="msg-flex">
    <p>Mensagem: ${usermsg}</p>
  </div>
  <p>Data: ${new Date().toLocaleDateString('pt-br')}</p>
</body>

</html>

  `;
}

module.exports = {
  contactEmailTemplate,
};
