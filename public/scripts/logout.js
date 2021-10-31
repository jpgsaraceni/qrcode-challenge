function logoutAdmin() {
  axios({
    method: 'post',
    url: '/logout',
  })
    .then(() => {
      localStorage.removeItem('@userphoto');
      window.location.href = '/admin';
    })
    .catch((error) => {
      console.log(error);
    });
}
