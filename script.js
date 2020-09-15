const $ = require("jquery");
require("howler");
const path = require("path");
// const {Howl, Howler} = require('howler');
const{dialog} = require("electron").remote

// let soundName = "01 Go Pagal - Jolly Llb 2 (SongsMp3.Com).mp3";
let soundName = [];
let likedSongs = [];
let tempLikedSongArr = [];
let idx = 0;
let length  = 0;
let howl = new Howl({
    src: [soundName]
});

$(document).ready(async function(){
    $("#liked-songs-container").hide();
    $("#stop").hide();
    $("#search-songs").hide();

    $("#songs").on("click",function(){
        $("#liked-songs-container").hide();
        $("#songs-queue").show();
    })
    $("#play").on("click",function(){
        howl.pause();
        howl.play();
        $("#stop").show();
        $("#play").hide();
    })

    $("#stop").on("click", function(){
        howl.pause();
        $("#play").show();
        $("#stop").hide();
    });
    
    $("#add-music").on("click",function(){
        let audio_file = dialog.showOpenDialog({properties:['openFile' ,'multiSelections']});
        audio_file.then(function(data){
            let songListThatAdd = data.filePaths
            for(let i = 0 ; i < songListThatAdd.length ; i++){
                if(soundName.includes(songListThatAdd[i])){continue}
                soundName.push(songListThatAdd[i]);
            }
            console.log(soundName);
            // howl.stop();
            howl = new Howl({
                src :[soundName[idx]]
            })

            length = soundName.length;
            console.log(length);

            $("#song-list").empty();
            for(let i = 0 ; i < soundName.length ; i++){
                 
                let fName = path.basename(soundName[i]);
                $("#song-list").append(
                `<div id=music-tab>
                    <div id=${i}>${fName}</div>
                    <button class="liked" id="liked-${i}" address="${soundName[i]}">
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                    </button>
                </div>`)               
                $(`#${i}`).on("click",function(){
                    idx=i;
                    howl.stop()
                    howl = new Howl({
                    src: [soundName[i]]
                    })
                    howl.play()
                    $("#stop").show();
                    $("#play").hide();
                })

                $(`#liked-${i}`).on("click",function(){
                    let songAddress = this.getAttribute('address');
                    tempLikedSongArr.push(songAddress);
                })

                $(`#liked-${i}`).on("click",function(){
                    $(`#liked-${i}`).css("background-color","green");
                })

            }

        })

        $("#liked-songs-container").hide();
        $("#songs-queue").show();
    })
    
    $("#liked-songs").on("click",function(){
        console.log(tempLikedSongArr.length);
        let change = false;
        if(tempLikedSongArr.length != 0){
            for(let i = 0 ; i < tempLikedSongArr.length ; i++){
                if(likedSongs.includes(tempLikedSongArr[i])){
                    continue;
                }else{
                    likedSongs.push(tempLikedSongArr[i]);
                    change=true;
                }
            }

            if(change==true){
                $("#liked-song-list").empty();
                for(let i = 0 ; i < likedSongs.length ; i++){
                    let fName = path.basename(likedSongs[i]);
                    $("#liked-song-list").append(`<div class ="music-tab" id="music-tab-${i}">
                        <button id="liked-song-${i}" >${fName}</button>
                        <button class="delete" id="delete-${i}" address="${likedSongs[i]}">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                        </div>`)  
                    
                    $(`#liked-song-${i}`).on("click",function(){
                        // console.log("hello");
                        idx=i;
                        howl.stop()
                        howl = new Howl({
                        src: [soundName[i]]
                        })
                        howl.play()
                        $("#stop").show();
                        $("#play").hide();
                    })

                    $(`#delete-${i}`).on("click",function(){
                        console.log("hello");
                        $(`#music-tab-${i}`).remove();
                    })
                }

                
            }
        }        
        tempLikedSongArr = [];
        $("#songs-queue").hide();
        $("#liked-songs-container").show();
    })

    $("#prev").on("click",function(){
        
        idx--;
        if(idx < 0){
            idx = soundName.length - 1;
        }
        console.log(soundName[idx]);
        howl.stop();
        howl = new Howl({
            src :[soundName[idx]]
        })
        howl.play();
        $("#stop").show();
        $("#play").hide();
    })

    $("#next").on("click",function(){
        idx++;
        if(idx >= soundName.length){
            idx = 0;
        }
        console.log(soundName[idx]);
        howl.stop();
        howl = new Howl({
            src :[soundName[idx]]
        })
        howl.play();
        $("#stop").show();
        $("#play").hide();
    })

    $("#random").on("click",function(){
        idx = getRandomInt(0,soundName.length);
        addAndPlay(soundName[idx]);
        $("#stop").show();
        $("#play").hide();
    })

    $("#search").on("input",function(){
        let input = $("#search").val();
        console.log(input)
        let searchSongArr = [];
        for(let i=0;i<soundName.length;i++){
            if(soundName[i].toLowerCase().includes(input.toLowerCase())){
                searchSongArr.push(soundName[i]);
            }
        }

        $("#search-songs").empty();
        for(let i = 0 ; i < searchSongArr.length ; i++){
            let searchSongsName = path.basename(searchSongArr[i]);
            $('#search-songs').append(
            `<div id=search-song-list>
            <button id="${soundName.length+i}">${searchSongsName}</button>
            <button class="liked" id="liked-${soundName.length+i}">
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                    </button>
            </div>`)

            $(`#${soundName.length+i}`).on("click",function(){
                idx=soundName.length+i;
                howl.stop()
                howl = new Howl({
                src: [searchSongArr[i]]
                })
                howl.play()
                $("#stop").show();
                $("#play").hide();
            })
        }

        if(input == ""){
            $("#search-songs").hide();
            $("#song-list").show();
        }else{
            if(searchSongArr.length==0){
                $('#search-songs').append('<div>no matched songs</div>')
            }
            $("#search-songs").show();
            $("#song-list").hide();
        }
    })
    
})

function play(){
    howl.pause();

    howl.play()
}

function addAndPlay(file_name){
    console.log(file_name)
    howl.stop()
    howl = new Howl({
    src: [file_name]
    })
    howl.play()
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function myFunction() {
    var x = document.getElementById("play");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }