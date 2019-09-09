// Variables
var title;
var numSongs;
var selectedPlaylists;

const playlistDiv = document.getElementById('playlist-choice-list');

// NAVIGATION BUTTONS
////////////////////////////////////////

document.getElementById('my-playlists-button').addEventListener("click", function(){
    window.location.href = "home.html";
});

document.getElementById('proceed-button').addEventListener("click", function(){
    let playlist_title = document.getElementById('name_playlist').value;
    if (playlist_title) title = playlist_title;
    else title = "Untitled Playlist";

});

document.getElementById('logout-button').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "index.html";
});


// GENERATE
////////////////////////////////////////

document.getElementById('list-messages-list').addEventListener("click", listPlaylist);

function generatePlaylist(userID) {
    userID = localStorage.getItem('userID');
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

function clearPlaylist() {
    while (playlistDiv.firstChild) {
      playlistDiv.removeChild(playlistDiv.firstChild);
    }
}

// List all playlists into playlist_choice_list
function listPlaylist() {
    userID = localStorage.getItem('userID');
    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-playlists",
        data: {
            user_id: userID,
        },
        success: function (result_playlists) {
            // console.log(result_playlist);
            if (selectedPlaylists) {
              if (selectedPlaylists.length !== result_playlists.playlists.length)
                selectedPlaylists = new Array(result_playlists.playlists.length).fill(0);
            }
            else selectedPlaylists = new Array(result_playlists.playlists.length).fill(0);
            clearPlaylist();
              for( let i = 0; i < result_playlists.playlists.length; i++ ) {
                loadPlaylist(result_playlists.playlists[i], i);
              }
        }
    });
}

function selectClick(event) {
    event.preventDefault();
    // console.log(event.srcElement.parentElement.dataset.index);
    var isElement = event.srcElement.parentElement.className.includes('playlist_element');
    var isHighlighted = event.srcElement.parentElement.className.includes('choice--highlighted');

    if(!isElement) return;
    if(isHighlighted) {
      selectedPlaylists[event.srcElement.parentElement.dataset.index] = 0;
      event.srcElement.parentElement.setAttribute('class', 'playlist_element mb-0');
    }
    else {
      selectedPlaylists[event.srcElement.parentElement.dataset.index] = 1;
      event.srcElement.parentElement.setAttribute('class', 'playlist_element mb-0 choice--highlighted');
    }
    // console.log(selectedPlaylists);
}

// Generates an Unordered List of the Playlists given the API data for "api/get-playlists"
function loadPlaylist(data, index){
      // Name of the Playlist in the list of playlists
      var playlist_title = data.name;

      // Creating the HTML Elements
      var list_element = playlistDiv.appendChild(document.createElement("tr"));
      var playlist_img = list_element.appendChild(document.createElement("td"));
      var playlist_img__img = playlist_img.appendChild(document.createElement("img"));
      var playlist_name = list_element.appendChild(document.createElement("td"));

      playlist_name.textContent = playlist_title;

      try {
        playlist_img__img.setAttribute('src', data.images[0].url);
      }
      catch (error) {
        console.log("Error loading thumbnail for song: ", data.name);
        playlist_img__img.setAttribute('src', '../assets/defaultsong.png');
      }
      playlist_img__img.setAttribute('class', 'playlist-choice__img');


      // Asserting Class and ID attributes to each element
      if( selectedPlaylists[index] ) list_element.setAttribute('class', 'playlist_element mb-0 choice--highlighted');
      else list_element.setAttribute('class', 'playlist_element mb-0');
      list_element.setAttribute('data-index', index);
      list_element.setAttribute('id', 'playlist-' + data.id);
      list_element.addEventListener("click", selectClick);

      playlistDiv.appendChild(list_element);
}
