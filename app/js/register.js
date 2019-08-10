'use strict'

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var registerBtn = document.getElementById('register-btn');

registerBtn.addEventListener('click', (event) => {
  event.preventDefault();

  var registerForm = document.getElementById('register-form');

  var fNameField = document.getElementById('register-fname').value;
  var lNameField = document.getElementById('register-lname').value;

  var unameField = document.getElementById('register-uname').value;
  var emailField = document.getElementById('register-email').value;

  var pass1Field = document.getElementById('register-pass1').value;
  var pass2Field = document.getElementById('register-pass2').value;

  var errorField = document.getElementById('register-err');

  if(pass1Field !== pass2Field) {
    document.getElementById('register-pass1').value = '';
    document.getElementById('register-pass2').value = '';
    errorField.innerHTML = "Error: Passwords do not match!";
    return;
  }
  firebase.auth()
  .createUserWithEmailAndPassword(emailField, pass1Field)
  .then(() => {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: fNameField + " " + lNameField
    }).
    then(() => {
      alert("Welcome, " + fNameField + " " + lNameField + "!" );
      registerForm.reset();
      remote.getCurrentWindow().close();
    })
    .catch( (error) => {
      errorField.innerHTML = "Error Updating User Info: " + error.message;
    });
  })
  .catch( (error) => {
    if(error != null) {
      document.getElementById('register-pass1').value = '';
      document.getElementById('register-pass2').value = '';
      errorField.innerHTML = "Error: " + error.message;
      return;
    }
  })

})
