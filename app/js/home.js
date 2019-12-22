
// NAVIGATION BUTTONS
////////////////////////////////////////

const playlistDiv = document.getElementById('row-playlist');
const client_id = 'baa5f3746bf74710bf3f6b18926993db';

window.onSpotifyPlayerAPIReady = () => {
    userID = localStorage.getItem('userID');
    token = localStorage.getItem('token');
    console.log(token);
    const player = new Spotify.Player({
        name: 'Turing',
        getOAuthToken: cb => {
            cb(token);
        }
    });
    // Ready
    player.on('initialization_error', e => console.error(e));
    player.on('authentication_error', e => console.error(e));
    player.on('account_error', e => console.error(e));
    player.on('playback_error', e => console.error(e));
    player.on('ready', data => {
        console.log('Ready with Device ID', data.device_id);
        localStorage.setItem('device_id', data.device_id);
    });

    // Connect to the player!
    player.connect();
};

document.getElementById('logout-button').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "index.html";
});

document.addEventListener('click', function (event) {
    if (event.target.matches('.redir-wrap')) {
        closePlaylist();
    }
});

document.getElementById('get-playlists-button').addEventListener('click', (e) => {
    e.preventDefault();
    initialize();
    return false;
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

// PLAYLIST/SONGLIST NAVIGATION
////////////////////////////////////////

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

function setProfile(data) {
    var profile_pic = document.getElementById('spotify-profile-pic');
    var profile_pic_img = profile_pic.appendChild(document.createElement("img"));
    profile_pic_img.setAttribute('src', data[1]);
    profile_pic_img.setAttribute('width', '50');
    profile_pic_img.setAttribute('class', 'clip-circle');
    var display_name = document.getElementById('spotify-name');
    display_name.appendChild(document.createTextNode(data[0]))
}

// PLAYLIST/SONGS LOAD AND PRINT
////////////////////////////////////////

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

function loadTracks(data, playlist_id) {
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

        if (track.is_local) continue;  // prevent local songs from being loaded

        var song_row = document.createElement('tr');
        song_row.setAttribute('id', track.uri);
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
    for (i = 0; i < data.playlist_tracks.length; i++) {
        var track = data.playlist_tracks[i].track;
        track_name = track.name.split('spotify:track:')[1];
        device_id = localStorage.getItem('device_id');
        document.getElementById(track.uri).addEventListener('click', (e) => {
            // play(device_id, track.uri);
            // getSong(device_id, track.uri, track.name, track.album.name, track.artists[0].name);
        });
    }
}

function get_songs_by_playlist(playlist_id) {
    userID = localStorage.getItem('userID');
    $.ajax({
      type: 'GET',
      url: "http://127.0.0.1:8000/api/get-songs-by-playlist",
      data: {
        user_id: userID,
        playlist_id: playlist_id,
      },
      success: async function (result) {
        // console.log("Retreived songs: ", result);
        loadTracks(result, playlist_id);
      }
    });
    return false;
}


// PAGE INITIALIZATION
////////////////////////////////////////

function initialize() {
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-playlists",
        data: {
            user_id: userID,
        },
        success: async function (result_playlists) {
            // console.log("Retreived playlists: ", result_playlist);
            clearPlaylist();
            for( let i = 0; i < result_playlists.playlists.length; i++ ) {
                loadPlaylist(result_playlists.playlists[i]);
                get_songs_by_playlist(result_playlists.playlists[i].id);
            }
            getToken();
            setPlaylistButtons();
            getProfile();
        }
    });
    return false;
}

function getProfile() {
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-profile",
        data: {
            user_id: userID,
        },
        success: async function (result_profile) {
            let data = ['Cool person', '../assets/defaultuser.png'];
            try {
                let data = [result_profile.name, result_profile.pic];
                setProfile(data);
            }
            catch(error) {
                console.log("Cannot get profile pic!");
                setProfile(data);
            }
        }
    });
    return false;
}

function play_pause(song, choice) {
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: ("http://127.0.0.1:8000/api/").concat(choice),
        data: {
            user_id: userID,
            track_uri: song,
        },
        success: async function (data) {
            let play_button = document.getElementById("play-pause-button");
            play_button.appendChild(document.createTextNode('play_circle_filled'));
        }
    });
    return false;
}

// NOTE: Playback functionality not working yet because the build of Spotipy we're using
// doesn't have that feature - we could switch to another Spotipy build such as

function getToken() {
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-token",
        data: {
            user_id: userID,
        },
        success: async function (data) {
            console.log(data);
            localStorage.setItem('token', data.token);
        }
    });
    return false;
}

// Testing alternative music player function
function play(device_id, track_id) {
    $.ajax({
        url: "https://api.spotify.com/v1/me/player/play?device_id=" + device_id,
        type: "PUT",
        data: '{"uris": ["' + track_id + '"]}',
        beforeSend: function(xhr){
            var token = localStorage.getItem('token');
            xhr.setRequestHeader('Authorization', 'Bearer ' + token );},
        success: function(data) {
            console.log(data);
        }
    });
}

function getSong(device_id, song, song_name, album, artist) {
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-song",
        data: {
            user_id: userID,
            track_uri: song,
            device_id: device_id,
        },
        success: async function (track) {
            let song_info = document.getElementById('song-info');
            let song_name_div = document.createElement('song-name');
            let album_div = document.createElement('album');
            let artist_div = document.createElement('artist');
            song_name_div.appendChild(document.createTextNode(song_name));
            album_div.appendChild(document.createTextNode(album));
            artist_div.appendChild(document.createTextNode(artist));
            song_info.appendChild(song_name_div);
            song_info.appendChild(album_div);
            song_info.appendChild(artist_div);
            // play_pause(song, "play");
        }
    });
    return false;
}

window.onload = initialize;
