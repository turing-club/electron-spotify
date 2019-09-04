// Navigation:
document.getElementById('my-playlists-button').addEventListener("click", function(){
    window.location.href = "home.html";
});

document.getElementById('get-playlists-button').addEventListener('click', function(){
    console.log("getplists");
});

document.getElementById('score-songs-button').addEventListener('click', function(){
    document.getElementById('setup-playlist').style.display='none';
    document.getElementById('score-songs').style.display='block';
    console.log("touch");
});
