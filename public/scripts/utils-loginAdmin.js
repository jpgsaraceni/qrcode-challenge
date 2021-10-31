document.getElementById('mainbutton').addEventListener('click', () => {
  const adminemail = document.getElementById('email').value;
  const adminpass = document.getElementById('password').value;

  if (!adminemail || !adminpass) {
    swal({
      title: 'Erro',
      text: 'Preencha todos os campos!',
      icon: 'error',
    });
  } else {
    axios({
      method: 'post',
      url: '/loginadmin',
      data: {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
      },
    }).then((response) => {
      if (response.data.res === '2' && response.data.type === 'admin') {
        localStorage.setItem('@userphoto', response.data.photo);
        window.location.href = '/admin/dashboard';
      } else if (response.data === 1) {
        swal({
          title: 'Alerta!',
          text: 'Senha incorreta.',
          icon: 'error',
        });
      } else if (response.data === 0) {
        swal({
          title: 'Alerta!',
          text: 'Usuário inexistente.',
          icon: 'error',
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
});
