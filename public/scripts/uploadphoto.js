let file;
const mainbutton = document.getElementById('mainbutton');

const acceptedFiles = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/svg',
  'image/svg+xml',
];

const api = axios.create({
  baseURL: 'https://api.cloudinary.com/v1_1/alphapets',
});

function fileSelectedHandler(archive) {
  file = archive;
}

const fileUploadHandler = async () => {
  if (acceptedFiles.includes(file.type)) {
    mainbutton.style.opacity = '0.5';
    mainbutton.disabled = true;
    mainbutton.style.cursor = 'not-allowed';
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ifdheemp');

    try {
      const { data } = await api.post('/image/upload', formData, {});
      localStorage.setItem('@userphoto', data.url);
      axios({
        method: 'post',
        url: '/changephoto',
        data: {
          imageurl: data.url,
        },
      }).then((response) => {
        console.log(response.data);
        mainbutton.style.opacity = '1.0';
        mainbutton.disabled = false;
        mainbutton.style.cursor = 'pointer';
        swal({
          title: 'Sucesso!',
          text: 'Foto de perfil alterada com sucesso.',
          icon: 'success',
          closeOnClickOutside: false,
        }).then((click) => {
          if (click) {
            window.location.reload();
          }
        });
      }).catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  } else {
    swal({
      title: 'Error!',
      text: 'Formato do arquivo não aceito.',
      icon: 'error',
      closeOnClickOutside: false,
    });
  }
};
