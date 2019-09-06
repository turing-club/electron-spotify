const playlistDiv = document.getElementById('row-playlist');

document.addEventListener('click', function (event) {
    if (event.target.matches('.redir-wrap')) {
        closePlaylist();
    }
});

// Try-Catch: DB
// Lets you navigate to generate-playlists.html, but while reusing this code on that page
// it throws error since the "generate-playlist-button" element does not
// exist in that file.
try {
    document.getElementById('generate-playlists-button').addEventListener("click", function(){
        window.location.href = "generate-playlists.html";
    });
}
catch {}


function setPlaylistButtons() {
    document.addEventListener('click', function (event) {
        if (event.target.matches('.playlist-open')) {
            openPlaylist(event.target.id.split('-')[2]);
        }
    });
}

function openPlaylist(playlist_id){
  // Hide and show appropriate
  document.getElementById('songlist-tab-' + playlist_id).style.display='block';
  document.getElementById('playlist-tab').style.display='none';
}

function closePlaylist(){
  // Hide and show appropriate
  document.getElementById('playlist-tab').style.display='block';
  var songlist = document.getElementsByClassName('songlist-tab');
  for (var i = 0; i < songlist.length; i++) {
      songlist[i].style.display = 'none';
  }
}

function clearPlaylist() {
  while (playlistDiv.firstChild) {
    playlistDiv.removeChild(playlistDiv.firstChild);
  }
}

function setTracks(data, playlist_id) {

    var song_table_wrapper = document.getElementById('songlist_table_' + playlist_id.toString());
    while (song_table_wrapper.firstChild) {
        song_table_wrapper.removeChild(song_table_wrapper.firstChild);
    }
    var song_table = document.createElement('tbody');
    song_table.setAttribute('id', 'table_songs_' + playlist_id.toString());
    // console.log(data.playlist_tracks);

    for (i = 0; i < data.playlist_tracks.length; i++) {
        var track = data.playlist_tracks[i].track;
        // console.log(track);
        var song_row = document.createElement('tr');
        var song_row_num = document.createElement('th');
        song_row_num.setAttribute('class', 'songlist__table__num');
        song_row_num.setAttribute('scope', 'row');
        song_row_num.appendChild(document.createTextNode(i));
        var song_img_wrapper = document.createElement('td');
        song_img_wrapper.setAttribute('class', 'songlist__table__img');
        var song_img = document.createElement('img');
        song_img.setAttribute('class', 'songlist__table__img');
        try {
            song_img.setAttribute('src', track.album.images[0].url);
        }
        catch (error) {
            // console.error(error);
            console.log("Error loading thumbnail for song: ", track.name);
            song_img.setAttribute('src', '../assets/defaultsong.png');
        }
        var song_info = document.createElement('td');
        var song_title = document.createElement('h4');
        song_title.setAttribute('class', 'songlist__table__title mb-2 font-weight-bold');
        song_title.appendChild(document.createTextNode(track.name));
        var song_artist = document.createElement('p');
        song_artist.setAttribute('class', 'songlist__table__artist mb-0');
        song_artist.appendChild(document.createTextNode(track.artists[0].name));
        var song_album = document.createElement('td');
        song_album.setAttribute('class', 'songlist__table__album');
        song_album.appendChild(document.createTextNode(track.album.name));

        song_row.appendChild(song_row_num);
        song_img_wrapper.appendChild(song_img);
        song_row.appendChild(song_img_wrapper);
        song_info.appendChild(song_title);
        song_info.appendChild(song_artist);
        song_row.appendChild(song_info);
        song_row.appendChild(song_album);

        song_table.appendChild(song_row);
    }
    song_table_wrapper.appendChild(song_table);
}

function loadPlaylist(data) {
  // Get data from JSON
  var title = data.name.toString();
  try {
      var imageurl = data.images[0].url;
  }
  catch (error) {
      // console.error(error);
      console.log("Error loading thumbnail for playlist: ", title);
      var imageurl = '../assets/defaultplaylist.png';
  }
  // console.log(data);
  var author = data.owner.display_name;


  // console.log(title, " ", author, " ", imageurl);
  var playlist_col = document.createElement('div');
  playlist_col.setAttribute('class', 'col');
  playlist_col.setAttribute('id', data.id);

  var playlist_card = document.createElement('div');
  playlist_card.setAttribute('class', 'card card--playlist');
  var playlist_card_hover = document.createElement('div');
  playlist_card_hover.setAttribute('class', 'card-img--hover playlist-open');
  playlist_card_hover.setAttribute('id', 'playlist-open-' + data.id.toString());
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

  var playlist_card_body_text = document.createElement('p');
  playlist_card_body_text.setAttribute('class', 'card-text');
  playlist_card_body_text.appendChild(document.createTextNode(author));

  playlist_card.appendChild(playlist_card_img);
  playlist_card_hover.appendChild(playlist_card_hover_icon);
  playlist_card.appendChild(playlist_card_hover);
  playlist_card_body.appendChild(playlist_card_body_title);
  playlist_card_body.appendChild(playlist_card_body_text);
  playlist_card.appendChild(playlist_card_body);

  var songlist_table_div = document.createElement('div');
  songlist_table_div.setAttribute('class', 'songlist__table container mt-5');
  songlist_table_div.setAttribute('id', 'songlist_table_div_' + data.id);
  var songlist_table = document.createElement('table');
  songlist_table.setAttribute('class', 'table table-borderless table-hover');
  songlist_table.setAttribute('id', 'songlist_table_' + data.id.toString());
  // console.log('songlist_table_' + data.id);
  songlist_table_div.appendChild(songlist_table);

  var songlist_tab = document.createElement('div');
  songlist_tab.setAttribute('id', 'songlist-tab-' + data.id.toString());
  songlist_tab.setAttribute('class', 'container songlist-tab');
  songlist_tab.setAttribute('style', 'display:none');

  var redirect_wrapper = document.createElement('div');
  redirect_wrapper.setAttribute('class', 'mt-5');
  var redirect_wrapper_h2 = document.createElement('h2');
  redirect_wrapper.appendChild(redirect_wrapper_h2);
  var redirect_wrapper_i = document.createElement('i');
  redirect_wrapper_i.setAttribute('id', 'redirect-playlists' + data.id.toString());
  redirect_wrapper_i.setAttribute('class', 'b--back material-icons redir-wrap');
  redirect_wrapper_i.appendChild(document.createTextNode('keyboard_backspace'));
  redirect_wrapper_h2.appendChild(redirect_wrapper_i);
  redirect_wrapper_h2.appendChild(document.createTextNode(title));
  redirect_wrapper.appendChild(redirect_wrapper_h2);
  songlist_tab.appendChild(redirect_wrapper);
  songlist_tab.appendChild(songlist_table_div);

  var body_tag = document.getElementById('body_tag');
  body_tag.appendChild(songlist_tab);

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
        success: function (result_playlist) {
            // console.log("Retreived playlists: ", result_playlist);
            clearPlaylist();
            for( let i = 0; i < result_playlist.playlists.length; i++ ) {
                loadPlaylist(result_playlist.playlists[i]);
                get_songs_by_playlist(result_playlist.playlists[i].id);
            }
            setPlaylistButtons();
        }
    });

    return false;
});

function get_songs_by_playlist(playlist_id) {
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-songs-by-playlist",
        data: {
            user_id: userID,
            playlist_id: playlist_id,
        },
        success: function (result) {
            // console.log("Retreived songs: ", result);
            setTracks(result, playlist_id);
        }
    });
    return false;

}
