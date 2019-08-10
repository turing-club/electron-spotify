'use strict'

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var loginBtn = document.getElementById('login-btn');

var registerLink = document.getElementById('login-redirect-link');

registerLink.addEventListener('click', () => {
  ipcRenderer.send('open-register');
  remote.getCurrentWindow().close();
})

loginBtn.addEventListener('click', (event) => {
  event.preventDefault();

  var emailField = document.getElementById('login-email').value;
  var passField = document.getElementById('login-pass').value;

  var errorField = document.getElementById('login-err');
  var registerField = document.getElementById('login-redirect');

  firebase.auth()
  .signInWithEmailAndPassword(emailField, passField)
  .then(() => {
    var user = firebase.auth().currentUser;
    alert("Welcome, " + user.displayName + "!");
    remote.getCurrentWindow().close();
  })
  .catch( (error) => {
    if(error != null) {
      document.getElementById('login-pass').value = '';
      errorField.innerHTML = "Error: " + error.message;
      registerField.classList.remove('d-none');
      return;
    }
  })
})
