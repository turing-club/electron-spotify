// Navigation:
document.getElementById('my-playlists-button').addEventListener("click", function(){
    window.location.href = "home.html";
});
document.getElementById('proceed-button').addEventListener("click", function(){
    console.log("machine learning step");
});

document.getElementById('logout-button').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "index.html";
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

            //clearPlaylistList(); // Need to make sure it doesn't keep appending every press
            listPlaylists(result_playlist);
        }
    });
});

// Generates an Unordered List of the Playlists given the API data for "api/get-playlists"
function listPlaylists(result_playlist){
    var track_list = document.getElementById('track-list');

    for( let i = 1; i < result_playlist.playlists.length; i++) {
        // Name of the Playlist in the list of playlists
        var playlist = result_playlist.playlists[i].name;

        // Creating the HTML Elements
        var list_element = track_list.appendChild(document.createElement("div"));
        var playlist_name = list_element.appendChild(document.createElement("div"));
        var select_playlist = list_element.appendChild(document.createElement("div"));

        // Asserting Class and ID attributes to each element
        list_element.setAttribute('class', 'row list-group-item h6');
        list_element.setAttribute('id', 'track-item' + i);

        playlist_name.setAttribute('class', 'col');
        select_playlist.setAttribute('class', 'col');

        playlist_name.textContent = playlist;
        select_playlist.textContent = "sel btn";
        //select_playlist.innerHTML= '<div class="form-check"><input class="form-check-input" type="checkbox" value="" id="defaultCheck1"><label class="form-check-label" for="defaultCheck1">Default checkbox</label></div>';


    }
}






// Reference Only: (not called) Brandon's Code for Adding HTML Elements
function add_track(track, device_id, i) {
    if (track !== undefined) {
        //console.log(device_id);
        client_id = device_id.toString();

        var track_list = document.getElementById('track-list');
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
