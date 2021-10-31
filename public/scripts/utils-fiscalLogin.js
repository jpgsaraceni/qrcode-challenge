document.getElementById('enter-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email && password) {
    fetch('http://localhost:80/fiscalLogin',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.res === '2') {
          localStorage.setItem('fiscal-name', data.name);
          window.location.href = '/collaborator/home';
        } else {
          document.getElementById('wrong-user-password').style.display = 'block';
        }
      }).catch((err) => console.log(err));
  }
  if (!email) {
    showMessage('no-email-message');
  }
  if (!password) {
    showMessage('no-password-message');
  }
});
