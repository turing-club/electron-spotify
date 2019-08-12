'use strict'

// Button Toggle
document.getElementById('login-reg-button').addEventListener('click', () => {
  let status = document.getElementById('login-reg-button');
  if(status.firstElementChild.id == 'register'){
    status.innerHTML='<a id="login" href="#">Log In</a>';
    showForm();
  }
  else{
    status.innerHTML='<a id="register" href="#">Sign Up</a>';
    showForm();
  }
});

// Function to Show or Hide the login/register forms on the landing page
function showForm(){  
  let status = document.getElementById('login-reg-button').firstChild.id;
  if(status == 'login'){
    document.getElementById('register-form').style="display:block";
    document.getElementById('login-form').style="display:none";
  }
  else{
    document.getElementById('login-form').style="display:block";
    document.getElementById('register-form').style="display:none";
  }
}