const tomorrow = new Date();
tomorrow.setDate(new Date().getDate() + 1);
const tomorrowFormated = new Date(tomorrow).toISOString().split('.')[0];

const datepicker = document.getElementById('eventdate');

datepicker.min = tomorrowFormated;
datepicker.value = tomorrowFormated;
