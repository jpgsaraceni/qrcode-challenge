const photo = localStorage.getItem('@userphoto');

axios({
  method: 'get',
  url: '/getname',
}).then((response) => {
  // console.log(response);

  const userProps = `<h1 class="welcome-text-user">${response.data}</h1>`;
  // console.log(userProps);
  document.getElementById('welcome').insertAdjacentHTML('afterend', userProps);

  const flexPhoto = `<div>
    <img src="${photo || 'assets/img/defaultuser.jpg'}"
        class="rounded-full profile-photo" alt="Foto de perfil" style="width: 105px; height: 105px;">
    </div>`;

  document.getElementById('flex-user').innerHTML += flexPhoto;
});
