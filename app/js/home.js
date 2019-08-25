const playlistDiv = document.getElementById('row-playlist');

document.getElementById('redirect-playlists').addEventListener('click', () => {
  closePlaylist();
})

function setPlaylistButtons(){
  var openPlaylists = document.getElementsByClassName('playlist-open');
  for( let i = 0; i < openPlaylists.length; i++ ) {
    openPlaylists[i].addEventListener('click', () => {
      openPlaylist();
    })
  }
}

function openPlaylist(){
  // Hide and show appropriate
  document.getElementById('songlist-tab').style="display:block";
  document.getElementById('playlist-tab').style="display:none";

  // Can probably enter data here
  document.getElementsByClassName('songlist__table__img')[0].src = "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0994d841602157.57ac63336b606.jpg";
  document.getElementsByClassName('songlist__table__title')[0].innerHTML = "One Dance";
  document.getElementsByClassName('songlist__table__artist')[0].innerHTML = "Drake";
  document.getElementsByClassName('songlist__table__album')[0].innerHTML = "Drake's Album";
}

function closePlaylist(){
  // Hide and show appropriate
  document.getElementById('playlist-tab').style="display:block";
  document.getElementById('songlist-tab').style="display:none";
}

function clearPlaylist() {
  while (playlistDiv.firstChild) {
    playlistDiv.removeChild(playlistDiv.firstChild);
  }
}

function loadPlaylist(data) {
  // Get data from JSON
  var title = data.name.toString();
  var imageurl = data.images[0].url;
  var author = data.owner.display_name;

  // console.log(title, " ", author, " ", imageurl);
  var playlist_col = document.createElement('div');
  playlist_col.setAttribute('class', 'col');
  playlist_col.setAttribute('id', data.id);

  var playlist_card = document.createElement('div');
  playlist_card.setAttribute('class', 'card card--playlist')
  var playlist_card_hover = document.createElement('div');
  playlist_card_hover.setAttribute('class', 'card-img--hover playlist-open');
  var playlist_card_hover_icon = document.createElement('i');
  playlist_card_hover_icon.setAttribute('class', 'b--open material-icons');
  playlist_card_hover_icon.appendChild(document.createTextNode("open_in_browser"));
  var playlist_card_img = document.createElement('img');
  playlist_card_img.setAttribute('class', 'card-img card-img-top');
  playlist_card_img.setAttribute('src', imageurl);

  var playlist_card_body = document.createElement('div');
  playlist_card_body.setAttribute('class', 'card-body');

  var playlist_card_body_title = document.createElement('h5');
  playlist_card_body_title.setAttribute('class', 'card-title mb-1');
  playlist_card_body_title.appendChild(document.createTextNode(title));

  var playlist_card_body_text = document.createElement('P');
  playlist_card_body_text.setAttribute('class', 'card-text');
  playlist_card_body_text.appendChild(document.createTextNode(author));

  playlist_card.appendChild(playlist_card_img);
  playlist_card_hover.appendChild(playlist_card_hover_icon);
  playlist_card.appendChild(playlist_card_hover);
  playlist_card_body.appendChild(playlist_card_body_title);
  playlist_card_body.appendChild(playlist_card_body_text);
  playlist_card.appendChild(playlist_card_body);

  playlist_col.appendChild(playlist_card);
  playlistDiv.appendChild(playlist_col);
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
            console.log("Retreived playlists: ", result);
            clearPlaylist();
            for( let i = 0; i < result.playlists.length; i++ ) {
              loadPlaylist(result.playlists[i]);
            }
            setPlaylistButtons();
        }
    });
    return false;
});
