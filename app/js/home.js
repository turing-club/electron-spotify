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