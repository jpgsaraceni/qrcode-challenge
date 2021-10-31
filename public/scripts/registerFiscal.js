let fileFiscal;

const mainbuttonFiscal = document.getElementById('mainbutton-fiscal');

const acceptedFilesFiscal = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'image/svg',
  'image/svg+xml',
];

const apiFiscal = axios.create({
  baseURL: 'https://api.cloudinary.com/v1_1/alphapets',
});

function registerFiscal(imageurl) {
  const fiscalName = $('#fiscalname').val();
  const fiscalEmail = $('#fiscalemail').val();
  const fiscalTelNumber = $('#fiscalnumber').val();
  const fiscalPassword = $('#fiscalpass').val();

  axios({
    method: 'post',
    url: '/newfiscal',
    data: {
      email: fiscalEmail,
      telnumber: fiscalTelNumber,
      name: fiscalName,
      password: fiscalPassword,
      photo: imageurl,
    },
  }).then((response) => {
    mainbuttonFiscal.style.opacity = '1.0';
    mainbuttonFiscal.disabled = false;
    mainbuttonFiscal.style.cursor = 'pointer';
    if (response.data === false) {
      swal({
        title: 'Erro!',
        text: 'Este Fiscal já existe!',
        icon: 'error',
        closeOnClickOutside: false,
      });
    } else {
      swal({
        title: 'Sucesso',
        text: 'Fiscal cadastrado com sucesso.',
        icon: 'success',
        closeOnClickOutside: false,
      }).then((click) => {
        if (click) {
          window.location.reload();
        }
      });
    }
  });
}

const fileUploadHandlerFiscal = async () => {
  const fiscalName = $('#fiscalname').val();
  const fiscalEmail = $('#fiscalemail').val();
  const fiscalTelNumber = $('#fiscalnumber').val();
  const fiscalPassword = $('#fiscalpass').val();
  if (!fiscalName || !fiscalEmail || !fiscalTelNumber || !fiscalPassword) {
    swal({
      title: 'Erro',
      text: 'Preencha todos os campos!',
      icon: 'error',
      closeOnClickOutside: false,
    });
  } else if (!acceptedFilesFiscal.includes(fileFiscal.type)) {
    swal({
      title: 'Erro!',
      text: 'Formato do arquivo não aceito.',
      icon: 'error',
      closeOnClickOutside: false,
    });
  } else {
    mainbuttonFiscal.style.opacity = '0.5';
    mainbuttonFiscal.disabled = true;
    mainbuttonFiscal.style.cursor = 'not-allowed';
    const formData = new FormData();
    formData.append('file', fileFiscal);
    formData.append('upload_preset', 'ifdheemp');

    try {
      const { data } = await apiFiscal.post('/image/upload', formData, {});
      registerFiscal(data.url);
    } catch (error) {
      console.log(error);
    }
  }
};

function fileSelectedHandlerFiscal(archive) {
  fileFiscal = archive;
}
