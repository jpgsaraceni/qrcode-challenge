let fileEvent;
const mainbuttonEvent = document.getElementById('mainbutton-event');

const acceptedFilesEvent = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/svg',
  'image/svg+xml',
];

const api2 = axios.create({
  baseURL: 'https://api.cloudinary.com/v1_1/alphapets',
});

const backend = axios.create({
  baseURL: 'http://localhost:80',
});

async function registerEvent(imageurl) {
  const eventName = $('#eventname').val();
  const eventDescription = $('#eventdescription').val();
  const eventDate = $('#eventdate').val();
  const eventCapacity = $('#capacity').val();

  const body = {
    name: eventName,
    description: eventDescription,
    date: eventDate,
    capacity: eventCapacity,
    image: imageurl,
  };

  try {
    await backend.post('/newevent', body);
  } catch (err) {
    console.log(err);
  }
  mainbuttonEvent.style.opacity = '1.0';
  mainbuttonEvent.disabled = false;
  mainbuttonEvent.style.cursor = 'pointer';
  swal({
    title: 'Sucesso!',
    text: 'Evento cadastrado com sucesso.',
    icon: 'success',
    closeOnClickOutside: false,
  }).then((click) => {
    if (click) {
      window.location.reload();
    }
  });
}

const fileUploadHandlerEvent = async () => {
  const eventName = $('#eventname').val();
  const eventDescription = $('#eventdescription').val();
  const eventDate = $('#eventdate').val();
  const eventCapacity = $('#capacity').val();

  if (!eventName || !eventDescription || !eventDate || !eventCapacity) {
    swal({
      title: 'Erro',
      text: 'Preencha todos os campos!',
      icon: 'error',
      closeOnClickOutside: false,
    });
  } else if (!acceptedFilesEvent.includes(fileEvent.type)) {
    swal({
      title: 'Erro!',
      text: 'Formato do arquivo não aceito.',
      icon: 'error',
      closeOnClickOutside: false,
    });
  } else {
    mainbuttonEvent.style.opacity = '0.5';
    mainbuttonEvent.disabled = true;
    mainbuttonEvent.style.cursor = 'not-allowed';
    const formData = new FormData();
    formData.append('file', fileEvent);
    formData.append('upload_preset', 'ifdheemp');

    try {
      const { data } = await api2.post('/image/upload', formData, {});
      registerEvent(data.url);
    } catch (error) {
      console.log(error);
    }
  }
};

function fileSelectedHandlerEvent(archive) {
  fileEvent = archive;
}
