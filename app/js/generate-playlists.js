// Navigation:
document.getElementById('my-playlists-button').addEventListener("click", function(){
    window.location.href = "home.html";
});
document.getElementById('proceed-button').addEventListener("click", function(){
    console.log("machine learning step");
});



// Recreating Clarence's work to get the playlist data but not in a card view
document.getElementById('get-playlists-button').addEventListener('click', (e) => {
    e.preventDefault();
    userID = localStorage.getItem('userID');
    console.log('hello');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-playlists",
        data: {
            user_id: userID,
        },
        success: function (result_playlist) {
            console.log(result_playlist);
            clearPlaylistList();
            listPlaylists(result_playlist);
        }
    });
});

// Generates an List of the Playlists given the API data for "api/get-playlists"
function listPlaylists(result_playlist){
    var track_list = document.getElementById('playlist-list');
    
    for( let i = 1; i < result_playlist.playlists.length; i++) {
        // Name of the Playlist in the list of playlists
        var playlist = result_playlist.playlists[i].name;
        var playlist_id = result_playlist.playlists[i].id;
        
        // Creating the HTML Elements
        var list_element = track_list.appendChild(document.createElement("div"));
        var playlist_name = list_element.appendChild(document.createElement("button"));
        
        // Button Attributes:
        playlist_name.setAttribute('class', "btn btn-light col");
        playlist_name.setAttribute('id', playlist_id);
        playlist_name.setAttribute('name-data', playlist);
        playlist_name.textContent = playlist;
        // Button Formatting:
        playlist_name.setAttribute('type', "button");
        playlist_name.setAttribute('data-toggle', "button");
        playlist_name.setAttribute('aria-pressed', "false");
        playlist_name.setAttribute('autocomplete', "off");

        // console.log(playlist_name);
        //listPlaylistsSelectHelper(result_playlist, playlist_name)
        playlist_name.addEventListener('click', handleClickEvent);
        
    }
}

// Handles what happens when you select or deselect a playlist on the Select Playlists screen
function handleClickEvent(event){
    var status = event.target.getAttributeNode('aria-pressed').value;
    var playlist_id = event.target.getAttributeNode('id').value;
    var playlist_name = event.target.getAttributeNode('name-data').value;
    if(status == 'false'){
        // add it to the list
        console.log(status);
        console.log('open + ' + playlist_name);
        var header_content = document.getElementById('playlist-header').appendChild(document.createElement('div'));
        header_content.setAttribute('id', playlist_id);
        header_content.setAttribute('class', "btn btn-light col");
        header_content.textContent = playlist_name;
    }
    else{
        // remove it from the list
        console.log(status);
        console.log("close + " + playlist_name);
        //playlist_id.remove();
        //playlist_id.outerHTML = "";
    }
}

function addHeader(){
    var playlist_header = document.getElementById('playlist-songs');
    playlist_name

}




// Empties the Playlist List such that the button does not continually append playlists
function clearPlaylistList(){
    var playlist_list = document.getElementById('playlist-list');
    while (playlist_list.firstChild) {
        //The list is LIVE so it will re-index each call
        playlist_list.removeChild(playlist_list.firstChild);
    }
}    


// 
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

function addPlaylist(data, playlist_id){
    var playlists = document.getElementById('playlist-list');
}


function showSongs(data, playlist_id){

}
/*
// Clarence's SetTracks
function setTracks(data, playlist_id) {

    var song_table_wrapper = document.getElementById('songlist_table_' + playlist_id.toString());
    while (song_table_wrapper.firstChild) {
        song_table_wrapper.removeChild(song_table_wrapper.firstChild);
    }

    var song_table = document.getElementById('playlist-songs').createElement('tbody');
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



*/

//  reference:
//
// Reference Only: (not called) Brandon's Code for Adding HTML Elements
function add_track(track, device_id, i) {
    if (track !== undefined) {
        //console.log(device_id);
        client_id = device_id.toString();
        
        var track_list = document.getElementById('playlist-list');
        var track_obj_div = document.createElement("a");
        var track_obj_row = document.createElement("div");
        var track_obj_name_col = document.createElement("div");
        var track_obj_artist_col = document.createElement("div");
        var track_obj_id = document.createElement("div");
        
        track_obj_div.setAttribute('class', 'list-group-item');
        track_obj_div.setAttribute('id', 'track-item' + i);
        track_obj_div.createTextNode(track)
        
        track_obj_row.setAttribute('class', 'row');
        track_obj_row.setAttribute('id', 'track-row');
        
        track_obj_name_col.setAttribute('class', 'col-xs-6 col-sm-6 col-md-6 col-lg-6');
        track_obj_artist_col.setAttribute('class', 'col-xs-6 col-sm-6 col-md-6 col-lg-6');
        
        track_obj_id.setAttribute('id', track.uri);
        track_obj_id.setAttribute('class', 'empty');
        
        var track_obj_name = document.createElement("track-object-name");
        track_obj_name.setAttribute('id', track.name);
        track_obj_name.appendChild(document.createTextNode(track.name));
        track_obj_name_col.appendChild(track_obj_name);
        track_obj_row.appendChild(track_obj_name_col);
        
        // append the div to the bottom of the list
        track_list.appendChild(track_obj_div);
        track_obj_div.setAttribute('onclick', 'select_track(this, client_id)');
    }
}