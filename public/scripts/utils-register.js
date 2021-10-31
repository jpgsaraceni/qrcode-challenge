document.getElementById('mainbutton-register').addEventListener('click', () => {
  axios({
    method: 'post',
    url: '/register',
    data: {
      email: document.getElementById('emailregister').value,
      telnumber: document.getElementById('telregister').value,
      name: document.getElementById('nameregister').value,
      password: document.getElementById('passwordregister').value,
    },
  })
    .then((response) => {
      if (response.data === true) {
        window.location.href = '/';
      } else if (response.data === false) {
        swal({
          title: 'Alerta!',
          text: 'E-mail ou telefone já cadastrados!.',
          icon: 'error',
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
