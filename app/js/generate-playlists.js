// Variables
var title;
var numSongs;
var selectedPlaylists;
var ratingInformation = {};

const carouselDiv = document.getElementById('playlist-carousel');
const playlistDiv = document.getElementById('playlist-choice-list');

// NAVIGATION BUTTONS
////////////////////////////////////////

document.getElementById('logout-button').addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.clear();
  window.location.href = "index.html";
});

document.getElementById('my-playlists-button').addEventListener("click", function(){
    window.location.href = "home.html";
});

document.getElementById('proceed-button').addEventListener("click", function(){
    var num_songs = document.getElementById('num_songs').value
    if (!num_songs) {
      alert("Please enter a number of songs!");
      window.location.href = "generate-playlists.html"; // reload page
      return;
    } // User must enter number of songs
    if (!selectedPlaylists) {
      alert("Please choose at least one playlist!");
      document.getElementById('list-messages-list').click(); // redirect
      return;
    } // User must choose at least one playlist

    let playlist_array = arrayFilter(selectedPlaylists);

    let playlist_title = document.getElementById('name_playlist').value;
    if (playlist_title) title = playlist_title;
    else title = "Untitled Playlist";

    console.log("Rate Songs for Playlist:", title, "!");
    console.log("Filtered List: ", playlist_array);

    document.getElementById('rate-playlist').style.display = "block";
    document.getElementById('setup-playlist').style.display = "none";

    userID = localStorage.getItem('userID');

    // API Call not working yet (forbidden)
    /*
    $.ajax({
        type: 'POST',
        url: "http://127.0.0.1:8000/api/choose-songs-to-rate",
        data: {
            user_id: userID,
            playlist_ids: playlist_array,
            number_songs: num_songs
        },
        success: function(result) {
            console.log(result);
        }
    });
    */

    // TEMPORARY DATA

    $.ajax({
        type: 'GET',
        url: "http://127.0.0.1:8000/api/get-playlists",
        data: {
            user_id: userID,
        },
        // TEMPORARY OBTAINING OF STUFF
        success: function (result_playlists) {
            console.log("Retreived playlists: ", result_playlists);

            for ( let i = 0; i < result_playlists.playlists.length; i++ ) {
              $.ajax({
                type: 'GET',
                url: "http://127.0.0.1:8000/api/get-songs-by-playlist",
                data: {
                  user_id: userID,
                  playlist_id: result_playlists.playlists[i].id,
                },
                success: function (result_songlist) {
                  // console.log("Retreived songs: ", result_songlist);
                  loadCarouselItem(result_playlists.playlists[i], result_songlist.playlist_tracks, result_playlists.playlists.length);
                }
              });
            }
        }
    });

});

// MISC
////////////////////////////////////////

function arrayFilter(array) {
    var newArray = [];
    for (var i = 0; i < array.length; i++ ) {
      if (array[i] !== "") newArray.push(array[i]);
    }
    return newArray;
}

function rate(event) {

    // Star Display
    var id = event.srcElement.dataset.id;
    var index = event.srcElement.dataset.index;
    var starIndex = event.srcElement.dataset.sindex;
    var parent = event.srcElement.parentElement;
    console.log("Song number", index, "in album", id, "rated:", starIndex, "stars!");

    while(parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
    var i = 0;
    while(i <= starIndex) {
      let star = createFullStar(id, i, index);
      parent.appendChild(star);
      i++;
    }
    while(i < 5) {
      let star = createEmptyStar(id, i, index);
      parent.appendChild(star);
      i++;
    }

    // Save rating data
    ratingInformation[id][index] = eval(parseInt(starIndex)+1);
    // console.log("Rating for album ", id, " updated: " ratingInformation[id]);

    return false;
}

function createEmptyStar(id, starIndex, index) {
    var star = document.createElement('span');
    star.setAttribute('class', 'material-icons md-18 md-btn');
    star.setAttribute('data-id', id);
    star.setAttribute('data-index', index);
    star.setAttribute('data-sindex', starIndex);
    star.appendChild(document.createTextNode('star_border'));
    star.addEventListener("click", rate);
    return star;
}

function createFullStar(id, starIndex, index) {
    var star = document.createElement('span');
    star.setAttribute('class', 'material-icons md-18 md-btn');
    star.setAttribute('data-id', id);
    star.setAttribute('data-index', index);
    star.setAttribute('data-sindex', starIndex);
    star.appendChild(document.createTextNode('star'));
    star.addEventListener("click", rate);
    return star;
}

// GENERATE
////////////////////////////////////////

document.getElementById('list-messages-list').addEventListener("click", listPlaylist);

// Empties the Playlist List such that the button does not continually append playlists
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
                selectedPlaylists = new Array(result_playlists.playlists.length).fill("");
            }
            else selectedPlaylists = new Array(result_playlists.playlists.length).fill("");
            clearPlaylist();
              for( let i = 0; i < result_playlists.playlists.length; i++ ) {
                loadPlaylist(result_playlists.playlists[i], i);
              }
        }
    });
}
// Handles what happens when you select or deselect a playlist on the Select Playlists screen
function selectClick(event) {
    event.preventDefault();
    // console.log(event.srcElement.parentElement.dataset.playlistid);
    var isElement = event.srcElement.parentElement.className.includes('playlist_element');
    var isHighlighted = event.srcElement.parentElement.className.includes('choice--highlighted');

    if(!isElement) return;
    var playlist_id = event.srcElement.parentElement.id.replace('playlist-','');
    if(isHighlighted) {
      selectedPlaylists[event.srcElement.parentElement.dataset.playlistid] = "";
      event.srcElement.parentElement.setAttribute('class', 'playlist_element mb-0');
    }
    else {
      selectedPlaylists[event.srcElement.parentElement.dataset.playlistid] = playlist_id;
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
    list_element.setAttribute('data-playlistid', index);
    list_element.setAttribute('id', 'playlist-' + data.id);
    list_element.addEventListener("click", selectClick);

    playlistDiv.appendChild(list_element);
}

function loadCarouselItem(playlist, songlist, totalPlaylist) {
    var indicator_index = carouselDiv.childElementCount;
    var playlistname = playlist.id;

    var carousel_item = document.createElement('div');
    var carousel_body = carousel_item.appendChild(document.createElement('div'));
    var carousel_bodywrapper = carousel_body.appendChild(document.createElement('div'));
    var carousel_description = carousel_bodywrapper.appendChild(document.createElement('h5'));
    var carousel_body_t = carousel_bodywrapper.appendChild(document.createElement('table'));
    var carousel_body_table = carousel_body_t.appendChild(document.createElement('tbody'));

    if(indicator_index == 0) carousel_item.setAttribute('class', 'carousel-item active');
    else carousel_item.setAttribute('class', 'carousel-item');
    carousel_body.setAttribute('class', 'songlist-rating-choice noscroll');
    carousel_bodywrapper.setAttribute('class', 'songlist-table-wrapper');
    carousel_description.appendChild(document.createTextNode("Rating: Playlist " + eval(indicator_index+1) + " of " + totalPlaylist))
    carousel_description.setAttribute('class', 't--center mt-5 mb-4');
    carousel_body_t.setAttribute('class', 'table table-borderless table-hover carousel-table');

    ratingInformation[playlistname] = new Array(songlist.length);

    for (let i = 0; i < songlist.length; i++) {
      var songitem = document.createElement('tr');
      var song_row_num = songitem.appendChild(document.createElement('th'));
      var song_info = songitem.appendChild(document.createElement('td'));
      var song_info_title = song_info.appendChild(document.createElement('h6'));
      var song_info_more = song_info.appendChild(document.createElement('p'));
      var song_rating = songitem.appendChild(document.createElement('td'));

      song_row_num.setAttribute('class', 'songlist__table__num');
      song_row_num.setAttribute('scope', 'row');
      song_row_num.appendChild(document.createTextNode(i));
      song_info_title.setAttribute('class', 'songlist__table__title mb-2 font-weight-bold');
      song_info_title.appendChild(document.createTextNode(songlist[i].track.name));
      song_info_more.setAttribute('class', 'songlist__table__artist mb-0');
      song_info_more.appendChild(document.createTextNode(songlist[i].track.artists[0].name + " - " + songlist[i].track.album.name));

      song_rating.setAttribute('class', 'songlist__table__rating');

      for (let j = 0; j < 5; j++) {
        let star = createEmptyStar(playlist.id, j, i);
        song_rating.appendChild(star);
      }

      carousel_body_table.appendChild(songitem);

      ratingInformation[playlistname][i] = 0; // Initialize rating
    }

    carouselDiv.appendChild(carousel_item);

    // console.log(ratingInformation);

  /* <li data-target="#playlist-carousel-wrapper" data-slide-to="0" class="active"></li> */
  /*
  <div class="carousel-item active">
    <div class="songlist-rating-choice">
      <table class="table table-borderless table-hover">
        <tbody id="playlist-choice-list">

        </tbody>
      </table>
    </div>
    <div class="carousel-caption d-none d-md-block">
      <h5>First slide label</h5>
    </div>
  </div>
  */
}
