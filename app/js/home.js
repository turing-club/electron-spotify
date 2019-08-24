document.getElementById('redirect-playlists').addEventListener('click', () => {
  closePlaylist();
})
document.getElementById('playlist-open').addEventListener('click', () => {
  openPlaylist();
})

function openPlaylist(){
  // Hide and show appropriate
  document.getElementById('songlist-tab').style="display:block";
  document.getElementById('playlist-tab').style="display:none";

  // Can probably enter data here
  document.getElementByClassName('songlist__table__img')[0].src = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0994d841602157.57ac63336b606.jpg";
  document.getElementByClassName('songlist__table__title')[0].innerHTML = "One Dance";
  document.getElementByClassName('songlist__table__artist')[0].innerHTML = "Drake";
  document.getElementByClassName('songlist__table__album')[0].innerHTML = "Drake's Album";
}

function closePlaylist(){
  // Hide and show appropriate
  document.getElementById('playlist-tab').style="display:block";
  document.getElementById('songlist-tab').style="display:none";
}

function generatePlaylist(userID) {
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:8000/api/generate",
        data: {
            user_id: userID,
        },
        success: function(result) {
            console.log(result);
        }
    });
}

document.getElementById('get-playlists-button').addEventListener('click', (e) => {
    e.preventDefault();
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-playlists",
        data: {
            user_id: userID,
        },
        success: function (result) {
            console.log(result);
        }
    });
    return false;
});
