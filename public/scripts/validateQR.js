/* eslint-disable no-use-before-define */
const acceptedFiles = [
  'image/png',
  'image/octet-stream',
];

function allowValidate(link) {
  const qrcodeForm = document.getElementById('button-validate');
  qrcodeForm.innerHTML = `
    <button onclick="validate('${link}');">Validar</button>
  `;
}

function fileSelectedHandlerFiscal(file) {
  document.getElementById('error').innerHTML = '';
  if (acceptedFiles.includes(file.type)) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      axios({
        method: 'post',
        url: '/receiveqrcode',
        data: {
          archive: reader.result,
        },
      }).then((response) => {
        allowValidate(response.data);
      }).catch((err) => console.log(err));
    };
  } else {
    swal({
      title: 'Erro!',
      text: 'Formato do arquivo não aceito.',
      icon: 'error',
      closeOnClickOutside: false,
    });
  }
}

function validate(link) {
  axios({
    method: 'post',
    url: link,
  })
    .then((response) => {
      if (response.data) {
        swal({
          title: 'Confirme os dados:',
          text: `Nome: ${response.data.owner} Evento: ${response.data.event}`,
          icon: 'warning',
          buttons: ['Cancelar', 'Confirmar entrada'],
          dangerMode: true,
        }).then((ok) => {
          if (ok) {
            axios({
              method: 'POST',
              url: '/checkUsed',
              data: { token: response.data.token },
            }).then((resp) => {
              if (resp.data === true) {
                swal({
                  title: 'Entrada liberada',
                  text: 'MEU DEEEUUUS',
                  icon: 'success',
                }).then(() => {
                  window.location.reload();
                });
              }
            });
          }
        });
      } else {
        document.getElementById('error').innerHTML = 'QR Code inválido ou já utilizado.';
      }
    })
    .catch((error) => console.log(error));
}
