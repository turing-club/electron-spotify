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