const recoverbtn = document.getElementById('recover-btn');

recoverbtn.addEventListener('click', () => {
  const userEmail = document.getElementById('email-recover-input').value;
  const userToken = document.getElementById('token-recover-input').value;
  const userPassword = document.getElementById('password-recover-input').value;
  console.log('clicado');
  if (!userEmail || !userToken || !userPassword) {
    swal({
      title: 'Erro!',
      text: 'Preencha todos os campos!',
      icon: 'error',
      closeOnClickOutside: false,
    });
  } else {
    axios({
      method: 'POST',
      url: '/resetpass',
      data: {
        newpass: userPassword,
        email: userEmail,
        token: userToken,
      },
    }).then((response) => {
      if (response.data === 3) {
        swal({
          title: 'Sucesso',
          text: 'Senha alterada com sucesso.',
          icon: 'success',
          closeOnClickOutside: false,
        }).then((click) => {
          if (click) {
            window.location.href = '/';
          }
        });
      } else if (response.data === 0) {
        swal({
          title: 'Erro',
          text: 'E-mail não encontrado.',
          icon: 'error',
          closeOnClickOutside: false,
        });
      } else if (response.data === 1) {
        swal({
          title: 'Erro',
          text: 'Token inválido.',
          icon: 'error',
          closeOnClickOutside: false,
        });
      } else if (response.data === 2) {
        swal({
          title: 'Erro',
          text: 'Token expirado.',
          icon: 'error',
          closeOnClickOutside: false,
        });
      } else {
        console.log(typeof (response.data));
        console.log(response.data);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
});
