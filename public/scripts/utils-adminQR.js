const qrcodesTokens = [];
const eventsDates = [];
const eventsNames = [];

function createQRCode(token) {
  let qr = null;
  qr = new QRious({
    element: document.getElementById('qrcode'),
    size: 200,
    value: `http://localhost:80/validate?token=${token}`,
  });
}

function showDetails(index) {
  const modal = document.getElementById('view-qrcode-details');

  modal.innerHTML = `
  <h1>Nome do evento: ${eventsNames[index]}</h1>
  <h3>Data do evento: ${eventsDates[index].slice(8, 10)}/${eventsDates[
  index
].slice(5, 7)}/${eventsDates[index].slice(0, 4)}</h3>

    <canvas id="qrcode"></canvas>
    `;

  createQRCode(qrcodesTokens[index]);

  $('#view-qrcode-details').modal({
    fadeDuration: 290,
  });
}

axios({
  method: 'get',
  url: '/isadmin',
}).then((response) => {
  if (response.data === true) {
    axios({
      method: 'get',
      url: '/qrcodelist',
    })
      .then((response2) => {
        response2.data.forEach((element, i) => {
          qrcodesTokens.push(element.token);
          eventsDates.push(element.event_date);
          eventsNames.push(element.event);
          document.getElementById('body-qrcodes').innerHTML += `<tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${element.id}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${element.token}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${element.owner}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${element.created_date}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
              ${
  element.used === true
    ? '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green white uppercase">Usado</span>'
    : '<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red white uppercase">Não usado</span>'
}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">${element.event_id}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <p class="text-gray-900 whitespace-no-wrap">
              <button onclick="showDetails(${i})" id="qrcode${
  element.id
}_delete"
                  type="button"
                  data-toggle="tooltip" data-placement="top" title="Mais informações"><i
                      class="fas fa-info-circle blue"></i></button>
              </p>
              </td>
            </tr>`;
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    window.location.href = '/admin/login';
  }
});
