console.log("hello");

async function GetSongs() {
    let songs = await fetch(`https://drive.google.com/drive/folders/14jS2QB7awfs2Y5z2x4nysns-x5yGtone?usp=sharing/`,{mode: 'no-cors'}).catch(error => {
  console.error(error);
});
    let result = await songs.text();

    let div = document.createElement("div");
    div.innerHTML = result;
    let a_tags = div.getElementsByTagName("a");

    Songs = [];

    for (let index = 0; index < a_tags.length; index++) {
        const element = a_tags[index];
        if (element.href.endsWith(".mp3")) {
            Songs.push(element.href.split(`/Songs/${folder}/`)[1].split(".mp3")[0]);
        }
    }
}

async function DisplaySongs() {
    let SongUL = document.querySelector(".songs").getElementsByTagName("ul")[0];
    
    SongUL.innerHTML = " ";
    for (const song of Songs) {
        SongUL.innerHTML = SongUL.innerHTML + `<li>
        <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="white" stroke="#000000" stroke-width="1.5" />
                <path d="M9.5 16V8L16 12L9.5 16Z" fill="black" stroke="#000000" stroke-width="1.5"
                    stroke-linejoin="round" />
            </svg>
        </button>
        <div class="music_name">${song.replaceAll("%20", " ")}</div>
        <div class="music_icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="6.5" cy="18.5" r="3.5" stroke="#9b9b9b" stroke-width="1.5"/>
                <circle cx="18" cy="16" r="3" stroke="#9b9b9b" stroke-width="1.5"/>
                <path d="M10 18.5L10 7C10 6.07655 10 5.61483 10.2635 5.32794C10.5269 5.04106 11.0175 4.9992 11.9986 4.91549C16.022 4.57222 18.909 3.26005 20.3553 2.40978C20.6508 2.236 20.7986 2.14912 20.8993 2.20672C21 2.26432 21 2.4315 21 2.76587V16" stroke="#9b9b9b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 10C15.8667 10 19.7778 7.66667 21 7" stroke="#9b9b9b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
        </div>
    </li>`;
    }

    Array.from(document.querySelector(".songs").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log("Clicked!");
            PlayMusic(`Songs/${folder}/` + e.querySelector(".music_name").innerHTML + ".mp3");
        })
    })
}

let current_song = new Audio();

function PlayMusic(track, first = 0) {
    if (first == 1) {
        current_song.src = track;
        document.querySelector(".SongInfo").innerHTML = "Currently Playing :   " + track.split(`Songs/${folder}/`)[1].split(".mp3")[0];
    }
    else {
        current_song.src = track;
        console.log(track);
        current_song.play();
        Play_Pause.src = "Images/Pause.svg";
        document.querySelector(".SongInfo").innerHTML = "Currently Playing :  " + track.split(`Songs/${folder}/`)[1].split(".mp3")[0];
    }
}

function secondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Adding leading zeros if necessary
    const minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
    const secondsString = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString();

    return `${minutesString}:${secondsString}`;
}

let Songs;
let folder = "Default";
console.log(folder);

async function main() {
    await GetSongs();
    let first_song = Songs[0].replaceAll("%20"," ");
    PlayMusic(`Songs/${folder}/` + first_song + ".mp3",1);

    await DisplaySongs();

    //Play/Pause Button
    Play_Pause.addEventListener("click", () => {
        if (current_song.paused) {
            current_song.play();
            Play_Pause.src = "Images/Pause.svg";
        }
        else {
            current_song.pause();
            Play_Pause.src = "Images/Play.svg";
        }
    })

    //Time Updates
    current_song.addEventListener("timeupdate", () => {
        document.querySelector(".SongTime").innerHTML = (`${secondsToMinutesAndSeconds(current_song.currentTime)}`);
        document.querySelector(".SongDuration").innerHTML = (`${secondsToMinutesAndSeconds(current_song.duration)}`);
        document.querySelector(".circle").style.left = (current_song.currentTime / current_song.duration) * 100 + "%";
    })

    //Seekbar Changes
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        current_song.currentTime = ((current_song.duration) * percent) / 100;
    })

    //hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "3px";
    })

    //close-hamburger
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //Previous and Next Song
    Prev.addEventListener("click",()=>{
        let index = Songs.indexOf(current_song.src.split(`Songs/${folder}/`)[1].split(".mp3")[0]);
        if(index-1<0){
            index = Songs.length-1;
        }
        else{
            index--;
        }
        PlayMusic(`Songs/${folder}/` + Songs[index].replaceAll("%20"," ") + ".mp3");
    })
    next.addEventListener("click",()=>{
        let size = Songs.length;
        let index = Songs.indexOf(current_song.src.split(`Songs/${folder}/`)[1].split(".mp3")[0]);
        index = (index+1)%size;
        PlayMusic(`Songs/${folder}/` + Songs[index].replaceAll("%20"," ") + ".mp3");
    })

    //volume controls
    document.querySelector(".volumebar").addEventListener("click",e=>{
        document.querySelector(".volumecircle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
        if((e.offsetX/e.target.getBoundingClientRect().width)*100 == 0){
            document.querySelector(".volume").src = document.querySelector(".volume").src.replace("Images/volume.svg","Images/mute.svg");
        }
        else{
            document.querySelector(".volume").src = document.querySelector(".volume").src.replace("Images/mute.svg","Images/volume.svg");
        }
        current_song.volume = (e.offsetX/e.target.getBoundingClientRect().width);
    })
    //Volume mute unmute
    document.querySelector(".volume").addEventListener("click",e=>{
        if(e.target.src.includes("Images/volume.svg")){
            e.target.src = e.target.src.replace("Images/volume.svg","Images/mute.svg");
            current_song.volume = 0;
            document.querySelector(".volumecircle").style.left = 0 + "%";
        }
        else{
            e.target.src = e.target.src.replace("Images/mute.svg","Images/volume.svg");
            current_song.volume = 1;
            document.querySelector(".volumecircle").style.left = 100 + "%";
        }
    })

    //Card Functioning
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async element => {
            folder = element.currentTarget.dataset.folder;
            await GetSongs();
            await DisplaySongs();
            let first_song = Songs[0].replaceAll("%20"," ");
            PlayMusic(`Songs/${folder}/` + first_song + ".mp3");
        })
    })

}
main()
