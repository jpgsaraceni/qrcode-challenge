/* eslint-disable func-names */
const baseUrl = 'http://localhost:80';
const username = localStorage.getItem('name');
const userId = localStorage.getItem('id');

document.getElementById('username').innerHTML = username;

fetch(`${baseUrl}/reservations`,
  {
    method: 'POST',
    body: JSON.stringify({ userId }),
    headers: { 'Content-Type': 'application/json' },
  })
  .then((response) => response.json())
  .then((data) => data.forEach((event) => {
    const card = document.createElement('div');
    card.classList.add('event-card');
    const eventString = JSON.stringify(event);

    card.innerHTML = `
      <h2>${event.event}</h2>
      ${event.event_image ? `<img src="${event.event_image}" alt="${event.name} picture" />` : ''}
      <h3>${event.event_date.slice(8, 10)}/${event.event_date.slice(5, 7)}/${event.event_date.slice(0, 4)}</h3>
      <button onClick='qrcodeModal(${eventString})'><a href="#qrcode" rel="modal:open">Ver QR Code</a></button>
      <button onClick='cancelReservationModal(${eventString})'>Cancelar Reserva</button>
    `;

    document.getElementById('events-container').append(card);
  }))
  .catch((error) => console.log(error));

document.getElementById('home-btn').addEventListener('click', () => {
  window.location.href = '/home';
});

document.getElementById('send-message').addEventListener('click', () => {
  const message = {};
  message.subject = document.getElementById('contact-us-subject').value;
  message.msg = document.getElementById('contact-us-body').value;
  message.mail = document.getElementById('contact-us-email').value;

  fetch(`${baseUrl}/sendcontactmail`, {
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

function qrcodeModal(data) {
  let qr;
  (function () {
    qr = new QRious({
      element: document.getElementById('qr-code'),
      size: 200,
      value: `http://localhost:80/validate?token=${data.token}`,
    });
  }());
  const canvas = document.getElementById('qr-code');
  image = canvas.toDataURL('image/png', 1.0).replace('image/png', 'image/octet-stream');
  const link = document.getElementById('qrcode-download');
  link.download = 'qrcode.png';
  link.href = image;
}

function cancelReservationModal(data) {
  swal({
    title: 'Tem certeza?',
    text: `Cancelar reserva para o ${data.event}`,
    icon: 'warning',
    buttons: ['Voltar', 'Sim'],
    dangerMode: true,
  }).then((ok) => {
    if (ok) {
      fetch('/cancelreservation',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: data.token }),
        }).then(() => window.location.reload())
        .catch((err) => console.log(err));
    }
  });
}

document.getElementById('logout-button').addEventListener('click', () => {
  fetch('/logout', {
    method: 'POST',
  }).then(() => {
    window.location.href = '/';
  }).catch((err) => console.log(err));
});
