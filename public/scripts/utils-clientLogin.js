const baseUrl = 'http://localhost:80';

const loginContainer = document.getElementById('login-right-side');
const signupContainer = document.getElementById('signup-right-side');

function showMessage(id) {
  document.getElementById(id).style.display = 'block';
}

document.getElementById('enter-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email && password) {
    fetch(`${baseUrl}/clientLogin`,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          window.location.href = '/home';
          localStorage.setItem('name', data.name);
          localStorage.setItem('id', data.id);
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

document.getElementById('open-signup-btn').addEventListener('click', () => {
  loginContainer.style.display = 'none';
  signupContainer.style.display = 'flex';
});

document.getElementById('open-login-btn').addEventListener('click', () => {
  signupContainer.style.display = 'none';
  loginContainer.style.display = 'flex';
});

document.getElementById('signup-btn').addEventListener('click', () => {
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirmPassword = document.getElementById('signup-confirm-password').value;
  const telnumber = document.getElementById('signup-tel').value;

  if (!name) showMessage('no-signup-name-message');
  if (!email) showMessage('no-signup-email-message');
  if (!password) showMessage('no-signup-password-message');
  if (!confirmPassword) showMessage('no-signup-confirm-password-message');
  if (password !== confirmPassword) showMessage('no-match-signup-password-message');
  if (!telnumber) showMessage('no-signup-tel-message');

  if (email && password && confirmPassword && (password === confirmPassword) && telnumber) {
    fetch(`${baseUrl}/clientSignup`,
      {
        method: 'POST',
        body: JSON.stringify({
          name, email, password, telnumber,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      .then((response) => response.json())
      .then((data) => {
        if (data === true) {
          window.location.href = '/';
        } else {
          document.getElementById('registered-email-message').style.display = 'block';
        }
      });
  }
});
