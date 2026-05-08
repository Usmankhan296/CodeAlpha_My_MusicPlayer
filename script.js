// 🔹 Songs Data
const songs = [
    {
        name: "Yung_kai-blue_lyrics",
        artist: "Erin Holand",
        src: "songs/song1.mpeg",
        cover: "https://s.yimg.com/fz/api/res/1.2/VuzgPqUJwPCsLimYBJtAGA--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpbGw7aD00MTI7cHhvZmY9NTA7cHlvZmY9MTAwO3E9ODA7c3M9MTt3PTM4OA--/https://i.pinimg.com/736x/bd/8a/66/bd8a66f09c67cd8061343fb2638d1770.jpg"
    },
    {
        name: "Alok,_Alan_Walker",
        artist: "Alka_Yagnik",
        src: "songs/song2.mpeg",
        cover: "https://tse3.mm.bing.net/th/id/OIP.RBXywZdFtKzUBVw0IdKBqAHaEo?pid=Api&h=220&P=0"
    },
    {
        name: "Dhara_Sugar_Lyrics",
        artist: "Monoir_laila",
        src: "songs/song3.mpeg",
        cover: "https://tse3.mm.bing.net/th/id/OIP.wFNupsS7IqzLjF0cH0yk7gHaEp?pid=Api&h=220&P=0"
    }
];

// 🔹 Global
let currentSong = 0;
const audio = new Audio();

// 🔹 Elements
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const progress = document.getElementById("progress");
const timeDisplay = document.getElementById("time");

const volumeSlider = document.querySelector(".volume input");


// 🔹 Load Song
function loadSong(index){
    audio.src = songs[index].src;
    title.innerText = songs[index].name;
    artist.innerText = songs[index].artist;
    cover.src = songs[index].cover;

    // reset UI
    progress.value = 0;
    timeDisplay.innerHTML = "00:00 / 00:00";
    timeDisplay.style.marginTop="5px"
    timeDisplay.style.color="white"
}


// 🔹 Play
function playSong(){
    audio.play().then(()=>{
        playBtn.src = "pause.svg";
        playBtn.style.width = "30px" ;
       playBtn.style.marginBottom="5px"
      
       
    }).catch(err=>{
        console.log("Play error:", err); 
    });
}


// 🔹 Pause
function pauseSong(){
    audio.pause();
    playBtn.src = "play.svg";
 playBtn.style.width = "40px";
 playBtn.style.marginBottom="0px"
}


// 🔹 Toggle Play
playBtn.addEventListener("click", ()=>{
    if(audio.paused){
        playSong();
    } else {
        pauseSong();
    }
});


// 🔹 Next
nextBtn.addEventListener("click", ()=>{
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
    playSong();
});


// 🔹 Previous
prevBtn.addEventListener("click", ()=>{
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
    playSong();
});


// 🔹 Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}


// 🔹 Metadata Load (duration fix)
audio.addEventListener("loadedmetadata", ()=>{
    progress.max = audio.duration;
});


// 🔹 Time Update (MAIN PART)
audio.addEventListener("timeupdate", ()=>{

    if (!isNaN(audio.duration)) {

        // update progress
        progress.value = audio.currentTime;

        // update time
        timeDisplay.innerHTML =
            `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }

});


// 🔹 Seek (drag)
progress.addEventListener("input", ()=>{
    audio.currentTime = progress.value;
});


// 🔹 Volume

const volumeIcon = document.getElementById("volumeicon");
const volumeRange = document.getElementById("volumerange");

let previousVolume = 1; // default full volume

// 🔊 slider se volume control
volumeRange.addEventListener("input", (e)=>{
    let vol = e.target.value / 100;
    audio.volume = vol;

    if(vol === 0){
        volumeIcon.src = "https://www.svgrepo.com/show/532521/volume-xmark.svg";
    } else {
        volumeIcon.src = "https://www.svgrepo.com/show/532519/volume-max.svg";
        previousVolume = vol;
    }
});


// 🔇 icon click → mute/unmute
volumeIcon.addEventListener("click", ()=>{

    if(audio.volume > 0){
        // mute
        previousVolume = audio.volume;
        audio.volume = 0;
        volumeRange.value = 0;

        volumeIcon.src = "https://www.svgrepo.com/show/532521/volume-xmark.svg";

    } else {
        // unmute
        audio.volume = previousVolume || 0.5;
        volumeRange.value = audio.volume * 100;

        volumeIcon.src = "https://www.svgrepo.com/show/532519/volume-max.svg";
    }

});


// 🔹 Auto Next
audio.addEventListener("ended", ()=>{
    nextBtn.click();
});


// 🔹 Start
loadSong(currentSong);