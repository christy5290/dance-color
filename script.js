//==================================================
// 身体の可能性
// script.js
// Part 1
//==================================================



//==================================================
// 時間設定（秒）
//==================================================

// タイトル表示
const TITLE_TIME = 30;

// 白背景
const WHITE_TIME = 15 * 60;

// 黒画面①
const BLACK1_TIME = 30;

// ランダム色
const RANDOM_COLOR_TIME = 5 * 60;

// 黒画面②
const BLACK2_TIME = 30;

// 最後
const FINAL_TIME = 10 * 60;



//==================================================
// ランダム時間
//==================================================

// 色変更
const COLOR_MIN = 30;
const COLOR_MAX = 60;

// 音
const SOUND_MIN = 60;
const SOUND_MAX = 180;



//==================================================
// DOM取得
//==================================================

const background = document.getElementById("background");

const titleScreen = document.getElementById("titleScreen");

const message = document.getElementById("message");

const startScreen = document.getElementById("startScreen");

const startButton = document.getElementById("startButton");



//==================================================
// 音声
//==================================================

const bell = document.getElementById("bell");

const sound1 = document.getElementById("sound1");

const sound2 = document.getElementById("sound2");

const sound3 = document.getElementById("sound3");

const sound4 = document.getElementById("sound4");



// ランダム再生用

const randomSounds = [

    sound2,
    sound3,
    sound4

];



//==================================================
// ランダム表示一覧
//==================================================

const scenes = [

    {
        name:"赤",
        color:"#ff0000",
        text:"",
        textColor:"white"
    },

    {
        name:"青",
        color:"#cfeeff",
        text:"",
        textColor:"black"
    },

    {
        name:"黄緑",
        color:"#dcffd5",
        text:"",
        textColor:"black"
    },

    {
        name:"黄色",
        color:"#fff8b5",
        text:"",
        textColor:"black"
    },

    {
        name:"止まれ",

        color:"#ffffff",

        text:"止まれ",

        textColor:"red"

    }

];



//==================================================
// 状態管理
//==================================================

let running = false;

let colorTimer = null;

let soundTimer = null;

let breathingTimer = null;



//==================================================
// ユーティリティ
//==================================================

// ランダム整数

function random(min,max){

    return Math.floor(

        Math.random()*(max-min+1)

    )+min;

}



// 秒→ミリ秒

function sec(value){

    return value*1000;

}



//==================================================
// 初期状態
//==================================================

background.className = "white";

message.innerHTML = "";

message.style.opacity = 0;

titleScreen.style.opacity = 1;

//==================================================
// Part2（修正版）
// 演出関数
//==================================================


//--------------------------------------
// 背景変更
//--------------------------------------

function setBackground(color){

    background.style.backgroundColor = color;

}



//--------------------------------------
// メッセージ表示
//--------------------------------------

function showMessage(text,color){

    message.innerHTML = text;
    message.style.color = color;
    message.style.opacity = 1;

}



//--------------------------------------
// メッセージ非表示
//--------------------------------------

function hideMessage(){

    message.style.opacity = 0;

    setTimeout(()=>{

        message.innerHTML="";

    },2000);

}



//--------------------------------------
// タイトルを消す
//--------------------------------------

function hideTitle(){

    titleScreen.style.opacity = 0;

    setTimeout(()=>{

        titleScreen.style.display="none";

    },3000);

}



//--------------------------------------
// 黒画面
//--------------------------------------

function blackScreen(){

    hideMessage();

    setBackground("#000000");

}



//--------------------------------------
// 白画面
//--------------------------------------

function whiteScreen(){

    hideMessage();

    setBackground("#ffffff");

}



//--------------------------------------
// シーン表示
//--------------------------------------

function showScene(scene){

    setBackground(scene.color);

    if(scene.text===""){

        hideMessage();

    }

    else{

        showMessage(scene.text,scene.textColor);

    }

}



//--------------------------------------
// ランダムシーン
//--------------------------------------

function showRandomScene(){

    const scene = scenes[random(0,scenes.length-1)];

    showScene(scene);

}



//--------------------------------------
// ベル
//--------------------------------------

function playBell(){

    bell.currentTime = 0;
    bell.play();

}



//--------------------------------------
// sound1
//--------------------------------------

function playSound1(){

    sound1.currentTime = 0;
    sound1.play();

}



//--------------------------------------
// ランダム音
//--------------------------------------

function playRandomSound(){

    const audio =

        randomSounds[

            random(0,randomSounds.length-1)

        ];

    audio.currentTime = 0;

    audio.play();

}



//==================================================
// 呼吸演出
//==================================================

function breathingLoop(){

    if(!running) return;



    const wait = random(20,60);



    breathingTimer = setTimeout(()=>{

        background.classList.add("breath");



        setTimeout(()=>{

            background.classList.remove("breath");



            breathingLoop();



        },10000);



    },wait*1000);

}



//--------------------------------------
// 呼吸開始
//--------------------------------------

function startBreathing(){

    stopBreathing();

    breathingLoop();

}



//--------------------------------------
// 呼吸停止
//--------------------------------------

function stopBreathing(){

    clearTimeout(breathingTimer);

    background.classList.remove("breath");

}



//==================================================
// ランダム色
//==================================================

function randomColorLoop(){

    if(!running) return;



    showRandomScene();



    const wait = random(

        COLOR_MIN,

        COLOR_MAX

    );



    colorTimer = setTimeout(

        randomColorLoop,

        wait*1000

    );

}



//--------------------------------------
// ランダム色開始
//--------------------------------------

function startRandomColors(){

    stopRandomColors();

    randomColorLoop();

}



//--------------------------------------
// ランダム色停止
//--------------------------------------

function stopRandomColors(){

    clearTimeout(colorTimer);

}



//==================================================
// ランダム音
//==================================================

function randomSoundLoop(){

    if(!running) return;



    const wait = random(

        SOUND_MIN,

        SOUND_MAX

    );



    soundTimer = setTimeout(()=>{

        playRandomSound();

        randomSoundLoop();

    },wait*1000);

}



//--------------------------------------
// ランダム音開始
//--------------------------------------

function startRandomSounds(){

    stopRandomSounds();

    randomSoundLoop();

}



//--------------------------------------
// ランダム音停止
//--------------------------------------

function stopRandomSounds(){

    clearTimeout(soundTimer);

}

//==================================================
// Part3
// タイムライン
//==================================================

function startPerformance(){

    if(running) return;

    running = true;

    // デバッグ用
    playSound1();

    // スタート画面を消す
    startScreen.style.display = "none";

    // 初期状態
    whiteScreen();

    //==============================
    // 0～30秒
    // タイトル
    //==============================

    setTimeout(()=>{

        hideTitle();

    },sec(TITLE_TIME));



    //==============================
    // 30秒後
    // 呼吸開始
    //==============================

    setTimeout(()=>{

        startBreathing();

    },sec(TITLE_TIME)+3000);



    //==============================
    // 15分30秒
    // 呼吸終了
    //==============================

    setTimeout(()=>{

        stopBreathing();

    },sec(TITLE_TIME+WHITE_TIME));



    //==============================
    // 黒画面①
    //==============================

    setTimeout(()=>{

        blackScreen();

    },sec(TITLE_TIME+WHITE_TIME));



    //==============================
    // ベル＋ランダム色
    //==============================

    setTimeout(()=>{

        playBell();

        startRandomColors();

    },sec(TITLE_TIME+WHITE_TIME+BLACK1_TIME));



    //==============================
    // ランダム色終了
    //==============================

    setTimeout(()=>{

        stopRandomColors();

        blackScreen();

        playSound1();

    },sec(

        TITLE_TIME+
        WHITE_TIME+
        BLACK1_TIME+
        RANDOM_COLOR_TIME

    ));



    //==============================
    // 最後の白画面
    //==============================

    setTimeout(()=>{

        whiteScreen();

        startRandomSounds();

    },sec(

        TITLE_TIME+
        WHITE_TIME+
        BLACK1_TIME+
        RANDOM_COLOR_TIME+
        BLACK2_TIME

    ));



    //==============================
    // 終了
    //==============================

    setTimeout(()=>{

        stopRandomSounds();

        whiteScreen();

        running=false;

        alert("作品が終了しました");

    },sec(

        TITLE_TIME+
        WHITE_TIME+
        BLACK1_TIME+
        RANDOM_COLOR_TIME+
        BLACK2_TIME+
        FINAL_TIME

    ));

}
//==================================================
// Part4
// スタート・終了・全画面
//==================================================


//--------------------------------------
// スタート
//--------------------------------------

startButton.addEventListener("click",()=>{

    if(running) return;

    startPerformance();

});



//--------------------------------------
// スペースキーでも開始
//--------------------------------------

document.addEventListener("keydown",(event)=>{

    if(event.code==="Space"){

        event.preventDefault();

        if(!running){

            startPerformance();

        }

    }

});



//--------------------------------------
// Fキーで全画面
//--------------------------------------

document.addEventListener("keydown",(event)=>{

    if(event.key==="f" || event.key==="F"){

        if(!document.fullscreenElement){

            document.documentElement.requestFullscreen();

        }

    }

});



//--------------------------------------
// ESCで終了
//--------------------------------------

document.addEventListener("keydown",(event)=>{

    if(event.key==="Escape"){

        emergencyStop();

    }

});



//--------------------------------------
// 緊急停止
//--------------------------------------

function emergencyStop(){

    running = false;

    clearTimeout(colorTimer);
    clearTimeout(soundTimer);
    clearTimeout(breathingTimer);

    stopRandomColors();
    stopRandomSounds();
    stopBreathing();

    bell.pause();
    sound1.pause();
    sound2.pause();
    sound3.pause();
    sound4.pause();

    bell.currentTime=0;
    sound1.currentTime=0;
    sound2.currentTime=0;
    sound3.currentTime=0;
    sound4.currentTime=0;

    message.innerHTML="";
    message.style.opacity=0;

    titleScreen.style.display="flex";
    titleScreen.style.opacity=1;

    whiteScreen();

    startScreen.style.display="flex";

    console.log("緊急停止しました");

}



//==================================================
// 音声の事前読み込み
//==================================================

window.addEventListener("load",()=>{

    bell.load();
    sound1.load();
    sound2.load();
    sound3.load();
    sound4.load();

});



//==================================================
// デバッグ用
//==================================================

// ブラウザのコンソールで
//
// emergencyStop();
//
// を入力すると
// 強制終了できます。
