const smsbtn = document.getElementById('sms-btn');

smsbtn.addEventListener('click', () => {
  const userNumber = document.getElementById('sms-input').value;
  console.log(userNumber);
  if (!userNumber) {
    swal({
      title: 'Erro!',
      text: 'Insira seu número com DDD!.',
      icon: 'error',
      closeOnClickOutside: false,
    });
  } else {
    smsbtn.style.opacity = '0.5';
    smsbtn.disabled = true;
    smsbtn.style.cursor = 'not-allowed';
    axios({
      method: 'post',
      url: '/sendsms',
      data: {
        telnumber: userNumber,
      },
    }).then((response) => {
      smsbtn.style.opacity = '1.0';
      smsbtn.disabled = false;
      smsbtn.style.cursor = 'pointer';
      if (response.data === true) {
        swal({
          title: 'Sucesso',
          text: 'SMS Enviado com sucesso.',
          icon: 'success',
          closeOnClickOutside: false,
        }).then((click) => {
          if (click) {
            window.location.href = '/recover';
          }
        });
      } else {
        swal({
          title: 'Erro',
          text: 'Número Não encontrado.',
          icon: 'error',
          closeOnClickOutside: false,
        });
      }
    });
  }
});
