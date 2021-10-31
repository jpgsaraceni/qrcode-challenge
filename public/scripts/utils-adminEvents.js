const baseUrl = 'http://localhost:80';
const descriptions = [];

function showDescription(index) {
  const modal = document.getElementById('view-eventdescription');

  modal.innerHTML = `
    ${descriptions[index] ? descriptions[index] : 'Sem descrição'}`;

  $('#view-eventdescription').modal({
    fadeDuration: 290,
  });
}

fetch(`${baseUrl}/eventList`)
  .then((response) => response.json())
  .then((data) => data.forEach((event, i) => {
    descriptions.push(event.description);
    const card = document.createElement('div');
    card.classList.add('event-card');
    card.classList.add(
      'shadow',
      'overflow-hidden',
      'border-b',
      'border-gray-200',
      'sm:rounded-lg',
    );

    card.innerHTML = `
      <h2>${event.name}</h2>
      ${event.image ? `<img src="${event.image}" alt="${event.name}">` : ''}
      <h3>${event.date.slice(8, 10)}/${event.date.slice(
  5,
  7,
)}/${event.date.slice(0, 4)}</h3>
      <button onclick="showDescription(${i});">Ver Descrição</button>
      </div>
    `;

    document.getElementById('card-container').append(card);
  }))
  .catch((err) => console.error(err));
