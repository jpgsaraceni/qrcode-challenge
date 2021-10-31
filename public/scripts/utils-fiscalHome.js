document.getElementById('username').innerHTML = localStorage.getItem('fiscal-name');

document.getElementById('send-message-fiscal').addEventListener('click', () => {
  const message = {};
  message.subject = document.getElementById('contact-us-subject').value;
  message.msg = document.getElementById('contact-us-body').value;
  message.mail = document.getElementById('contact-us-email').value;

  fetch('http://localhost:80/sendcontactmail', {
    method: 'POST',
    body: JSON.stringify(message),
    headers: { 'Content-Type': 'application/json' },
  }).then((response) => response.json())
    .then((data) => {
      if (data) {
        swal({
          title: 'Mensagem cadastrada.',
          text: 'Em breve, entraremos em contato pelo seu email.',
          icon: 'success',
        });
      }
    }).catch((err) => console.log(err));
});

document.getElementById('logout-btn').addEventListener('click', () => {
  axios({
    method: 'POST',
    url: '/logout',
  }).then(() => {
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    window.location.href = '/collaborator';
  }).catch((err) => console.log(err));
});
