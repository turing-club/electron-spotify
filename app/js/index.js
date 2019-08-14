'use strict';

const { BrowserWindow } = require('electron').remote;
let csrftoken = Cookies.get('csrftoken');
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
});


$(document).on("click", ".register", function(event){
  let status = document.getElementById('login-reg-button');
  status.innerHTML='<a class="login" href="#">Login</a>';
  showForm('login');
});

$(document).on("click", ".login", function(event){
    let status = document.getElementById('login-reg-button');
    status.innerHTML='<a class="register" href="#">Sign Up</a>';
    showForm('register');
});

// Function to Show or Hide the login/register forms on the landing page
function showForm(status){
  if (status === 'login'){
    document.getElementById('register-form').style="display:block";
    document.getElementById('login-form').style="display:none";
  }
  else {
    document.getElementById('login-form').style="display:block";
    document.getElementById('register-form').style="display:none";
  }
}

function sendError() {
    document.getElementById('error').innerHTML = '  <div class="alert alert-warning alert-dismissible fade show" role="alert">\n' +
        '      <strong>Holy guacamole!</strong> You should check in on some of those fields below.\n' +
        '      <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n' +
        '        <span aria-hidden="true">&times;</span>\n' +
        '      </button>\n' +
        '    </div>';
}
async function openSpotifyWindow(userID) {
    console.log('clicked');
    let authWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        'node-integration': false,
        'web-security': false
    });
    let authUrl = 'https://accounts.spotify.com/authorize?response_type=code&client_id=baa5f3746bf74710bf3f6b18926993db&redirect_uri=http://127.0.0.1:8000/setup-success';

    await authWindow.loadURL(authUrl);
    authWindow.show();
    authWindow.webContents.openDevTools();
    authWindow.webContents.on('did-redirect-navigation', function (event, newUrl) {
        event.preventDefault();
        console.log(newUrl);
        if (newUrl.includes('code=')) {
            let code = newUrl.split('code=')[1];
            authWindow.close();
            addCodeToUser(code, userID);
            window.location.href = "home.html";
        } else {
            authWindow.close();
            sendError();
        }
    });

    authWindow.on('closed', function() {
        authWindow = null;
    });
}

function addCodeToUser(code, userID) {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:8000/api/add-code",
        data: {
            code : code,
            user_id: userID,
        },
        success: function(result) {
            console.log(result);
        }
    });
}

document.getElementById('register-form-button').addEventListener('click', (e) => {
    e.preventDefault();
   let username = document.getElementById('register-username').value;
   let password = document.getElementById('register-password').value;
   let email = document.getElementById('register-email').value;
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:8000/api/register",
        data: {
            username : username,
            password: password,
            email: email,
        },
        success: async function(result) {
            console.log(result);
            if (result.status === 200) {
                localStorage.setItem('userID', result.user_id);
                await openSpotifyWindow(result.user_id);
            } else {
                sendError();
            }
        }
    });
   return false;
});

document.getElementById('login-form-button').addEventListener('click', (e) => {
    e.preventDefault();
    let username = document.getElementById('log-in-username').value;
    let password = document.getElementById('log-in-password').value;
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:8000/api/login",
        data: {
            username : username,
            password: password,
        },
        success: async function(result) {
            console.log(result);
            if (result.status === 200) {
                localStorage.setItem('userID', result.user_id);
                window.location.href = "home.html";
            } else {
                sendError();
                return false;
            }
        }
    });
    return false;
});