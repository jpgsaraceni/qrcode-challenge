/* eslint-disable no-return-assign */
const emailbtn = document.getElementById('email-btn');

emailbtn.addEventListener('click', () => {
  const userEmail = document.getElementById('email-input').value;
  const browser = bowser.getParser(window.navigator.userAgent);
  const currentOs = browser.getOSName();
  const currentOsversion = browser.getOSVersion();
  const currentBrowser = browser.getBrowserName();
  let currentIP = null;
  getIPs().then((res) => {
    currentIP = res;
    if (!userEmail) {
      swal({
        title: 'Erro!',
        text: 'Insira seu E-mail.',
        icon: 'error',
        closeOnClickOutside: false,
      });
    } else {
      emailbtn.style.opacity = '0.5';
      emailbtn.disabled = true;
      emailbtn.style.cursor = 'not-allowed';
      axios({
        method: 'POST',
        url: '/sendemail',
        data: {
          email: userEmail,
          userBrowser: currentBrowser,
          userOS: currentOs,
          userOSversion: currentOsversion,
          userIP: currentIP,
        },
      }).then((response) => {
        emailbtn.style.opacity = '1.0';
        emailbtn.disabled = false;
        emailbtn.style.cursor = 'pointer';
        if (response.data === true) {
          swal({
            title: 'Sucesso',
            text: 'E-mail Enviado com sucesso.',
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
            text: 'E-mail Não encontrado.',
            icon: 'error',
            closeOnClickOutside: false,
          });
        }
      });
    }
  });
});
