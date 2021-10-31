/* eslint-disable func-names */
const baseUrl = 'http://localhost:80';
const username = localStorage.getItem('name');
const userId = localStorage.getItem('id');

document.getElementById('username').innerHTML = username;

fetch(`${baseUrl}/eventList`)
  .then((response) => response.json())
  .then((data) => data.forEach((event) => {
    const card = document.createElement('div');
    card.classList.add('event-card');
    const eventString = JSON.stringify(event);

    card.innerHTML = `
      <h2>${event.name}</h2>
      ${event.image ? `<img src="${event.image}" alt="${event.name} picture" />` : ''}
      <h3>${event.date.slice(8, 10)}/${event.date.slice(5, 7)}/${event.date.slice(0, 4)}</h3>
      <button onClick='chooseEvent(${eventString})'><a href="#event-details" rel="modal:open">Eu quero!</a></button>
      </div>
    `;

    document.getElementById('events-container').append(card);
  })).catch((err) => console.error(err));

function chooseEvent(event) {
  const availability = event.capacity - event.reservations;

  document.getElementById('event-name-modal').innerHTML = event.name;
  document.getElementById('event-date-modal').innerHTML = `
    ${event.date.slice(8, 10)}/${event.date.slice(5, 7)}/${event.date.slice(0, 4)}
  `;
  document.getElementById('event-availability-modal').innerHTML = `
    Vagas disponíveis: ${availability}
  `;

  if (availability > 0) { // future implementation: block button on card for better UX.
    document.getElementById('open-qrcode-modal-btn').disabled = false;
    document.getElementById('open-qrcode-modal-btn').href = '#qrcode';
    document.getElementById('participate-btn-container').innerHTML = `
      <button id="participate-btn" value=${event}>Confirmar reserva</button>
    `;
    document.getElementById('participate-btn').addEventListener('click', () => {
      fetch(`${baseUrl}/generateqrcode`,
        {
          method: 'POST',
          body: JSON.stringify({
            userId,
            username,
            event: event.name,
            eventId: event.id,
            eventDate: event.date,
            eventImage: event.image,
          }),
          headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            document.getElementById('successfully-reserved').style.display = 'block';
            document.getElementById('already-reserved').style.display = 'none';
            document.getElementById('qrcode-download').style.display = 'block';
            document.getElementById('qr-code').style.display = 'block';
            let qr;
            (function () {
              qr = new QRious({
                element: document.getElementById('qr-code'),
                size: 200,
                value: `http://localhost:80/validate?token=${data}`,
              });
            }());
            const canvas = document.getElementById('qr-code');
            image = canvas.toDataURL('image/png', 1.0).replace('image/png', 'image/octet-stream');
            const link = document.getElementById('qrcode-download');
            link.download = 'qrcode.png';
            link.href = image;
          } else {
            document.getElementById('successfully-reserved').style.display = 'none';
            document.getElementById('already-reserved').style.display = 'block';
            document.getElementById('qrcode-download').style.display = 'none';
            document.getElementById('qr-code').style.display = 'none';
          }
        }).catch((err) => console.log(err));
    });
  } else {
    document.getElementById('participate-btn-container').innerHTML = `
     <div id="no-vacancies-message">Vagas Esgotadas!</div>
    `;
    document.getElementById('open-qrcode-modal-btn').disabled = true;
    document.getElementById('open-qrcode-modal-btn').href = '#';
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  fetch('/logout', {
    method: 'POST',
  }).then(() => {
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    window.location.href = '/';
  }).catch((err) => console.log(err));
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

document.getElementById('my-reservations-btn').addEventListener('click', () => {
  window.location.href = '/events';
});
