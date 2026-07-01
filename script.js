//==================================================
// 身体の可能性（改修版：状態管理エンジン）
// script.js
//==================================================


//==============================
// 時間設定（秒）
//==============================
const TITLE_TIME = 15;
const WHITE1_TIME = 60;
const BLACK1_TIME = 30;
const WHITE2_TIME = 300;
const RANDOM_COLOR_TIME = 300;
const BLACK2_TIME = 30;
const FINAL_TIME = 600;


//==============================
// ランダム設定
//==============================
const COLOR_MIN = 30;
const COLOR_MAX = 60;

const SOUND_MIN = 60;
const SOUND_MAX = 180;


//==============================
// DOM
//==============================
const background = document.getElementById("background");
const titleScreen = document.getElementById("titleScreen");
const message = document.getElementById("message");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");


//==============================
// 音声
//==============================
const bell = document.getElementById("bell");
const sound1 = document.getElementById("sound1");
const sound2 = document.getElementById("sound2");
const sound3 = document.getElementById("sound3");
const sound4 = document.getElementById("sound4");

const randomSounds = [sound2, sound3, sound4];


//==============================
// シーン
//==============================
const scenes = [
    { name:"赤", color:"#ff0000", text:"", textColor:"white" },
    { name:"青", color:"#cfeeff", text:"", textColor:"black" },
    { name:"黄緑", color:"#dcffd5", text:"", textColor:"black" },
    { name:"黄色", color:"#fff8b5", text:"", textColor:"black" },
    { name:"止", color:"#ffffff", text:"止", textColor:"black" }
];


//==============================
// 状態管理
//==============================
let running = false;
let state = "IDLE";

let startTime = 0;
let rafId = null;

let colorTimer = null;
let soundTimer = null;
let breathingTimer = null;

let SPEED = 1;


//==============================
// ユーティリティ
//==============================
function random(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sec(v){
    return v * 1000 / SPEED;
}
//==============================
// 背景
//==============================
function setBackground(color){
    background.style.backgroundColor = color;
}

function blackScreen(){
    hideMessage();
    background.classList.remove("white");
    background.classList.add("black");
}

function whiteScreen(){
    hideMessage();
    background.classList.remove("black");
    background.classList.add("white");
}


//==============================
// メッセージ
//==============================
function showMessage(text, color){
    message.innerHTML = text;
    message.style.color = color;
    message.style.opacity = 1;
}

function hideMessage(){
    message.style.opacity = 0;
    setTimeout(() => {
        message.innerHTML = "";
    }, 1500);
}


//==============================
// タイトル
//==============================
function hideTitle(){
    titleScreen.style.opacity = 0;
    setTimeout(() => {
        titleScreen.style.display = "none";
    }, 2000);
}


//==============================
// シーン
//==============================
function showScene(scene){
    setBackground(scene.color);

    if(scene.text === ""){
        hideMessage();
    } else {
        showMessage(scene.text, scene.textColor);
    }
}

function showRandomScene(){
    const scene = scenes[random(0, scenes.length - 1)];
    showScene(scene);
}


//==============================
// 音
//==============================
function playBell(){
    bell.currentTime = 0;
    bell.play();
}

function playSound1(){
    sound1.currentTime = 0;
    sound1.play();
}

function playRandomSound(){
    const audio = randomSounds[random(0, randomSounds.length - 1)];
    audio.currentTime = 0;
    audio.play();
}
//==============================
// 呼吸
//==============================
function breathingLoop(){
    if(!running) return;

    const wait = random(20, 60);

    breathingTimer = setTimeout(() => {

        background.classList.add("breath");

        setTimeout(() => {
            background.classList.remove("breath");
            breathingLoop();
        }, 10000);

    }, wait * 1000);
}

function startBreathing(){
    stopBreathing();
    breathingLoop();
}

function stopBreathing(){
    clearTimeout(breathingTimer);
    background.classList.remove("breath");
}


//==============================
// ランダム色
//==============================
function randomColorLoop(){
    if(!running) return;

    showRandomScene();

    const wait = random(COLOR_MIN, COLOR_MAX);

    colorTimer = setTimeout(() => {
        randomColorLoop();
    }, wait * 1000);
}

function startRandomColors(){
    stopRandomColors();
    randomColorLoop();
}

function stopRandomColors(){
    clearTimeout(colorTimer);
}


//==============================
// ランダム音
//==============================
function randomSoundLoop(){
    if(!running) return;

    const wait = random(SOUND_MIN, SOUND_MAX);

    soundTimer = setTimeout(() => {
        playRandomSound();
        randomSoundLoop();
    }, wait * 1000);
}

function startRandomSounds(){
    stopRandomSounds();
    randomSoundLoop();
}

function stopRandomSounds(){
    clearTimeout(soundTimer);
}

//==============================
// 状態管理
//==============================
function setState(s){
    state = s;
    console.log("STATE:", state);
}


//==============================
// メインエンジン
//==============================
function startPerformance(){

    if(running) return;

    running = true;
    startTime = Date.now();

    setState("TITLE");

    startScreen.style.display = "none";
    whiteScreen();

    rafLoop();
}

function rafLoop(){

    if(!running) return;

    const t = (Date.now() - startTime) / 1000;

    if(t < TITLE_TIME){
        setState("TITLE");
    }

    else if(t < TITLE_TIME + WHITE1_TIME){
        setState("WHITE1");
        whiteScreen();
    }

    else if(t < TITLE_TIME + WHITE1_TIME + BLACK1_TIME){
        setState("BLACK1");
        blackScreen();
    }

    else if(t < TITLE_TIME + WHITE1_TIME + BLACK1_TIME + WHITE2_TIME){
        if(state !== "WHITE2"){
            setState("WHITE2");
            whiteScreen();
            startBreathing();
        }
    }

    else if(t < TITLE_TIME + WHITE1_TIME + BLACK1_TIME + WHITE2_TIME + RANDOM_COLOR_TIME){
        if(state !== "RANDOM"){
            setState("RANDOM");
            stopBreathing();
            playBell();
            startRandomColors();
        }
    }

    else if(t < TITLE_TIME + WHITE1_TIME + BLACK1_TIME + WHITE2_TIME + RANDOM_COLOR_TIME + BLACK2_TIME){
        if(state !== "BLACK2"){
            setState("BLACK2");
            stopRandomColors();
            blackScreen();
            playSound1();
        }
    }

    else if(t < TITLE_TIME + WHITE1_TIME + BLACK1_TIME + WHITE2_TIME + RANDOM_COLOR_TIME + BLACK2_TIME + FINAL_TIME){
        if(state !== "FINAL"){
            setState("FINAL");
            whiteScreen();
            startRandomSounds();
        }
    }

    else {
        endPerformance();
        return;
    }

    rafId = requestAnimationFrame(rafLoop);
}


//==============================
// 終了
//==============================
function endPerformance(){

    running = false;
    setState("IDLE");

    cancelAnimationFrame(rafId);

    stopRandomColors();
    stopRandomSounds();
    stopBreathing();

    bell.pause();
    sound1.pause();
    sound2.pause();
    sound3.pause();
    sound4.pause();

    whiteScreen();

    startScreen.style.display = "flex";

    alert("作品が終了しました");
}


//==============================
// 緊急停止
//==============================
function emergencyStop(){

    running = false;
    setState("IDLE");

    cancelAnimationFrame(rafId);

    stopRandomColors();
    stopRandomSounds();
    stopBreathing();

    bell.pause();
    sound1.pause();
    sound2.pause();
    sound3.pause();
    sound4.pause();

    whiteScreen();

    startScreen.style.display = "flex";

    console.log("EMERGENCY STOP");
}


//==============================
// 操作
//==============================
startButton.addEventListener("click", startPerformance);

document.addEventListener("keydown", (e) => {

    if(e.code === "Space"){
        e.preventDefault();
        startPerformance();
    }

    if(e.key === "f" || e.key === "F"){
        if(!document.fullscreenElement){
            document.documentElement.requestFullscreen();
        }
    }

    if(e.key === "Escape"){
        emergencyStop();
    }
});


//==============================
// 音読み込み
//==============================
window.addEventListener("load", () => {
    bell.load();
    sound1.load();
    sound2.load();
    sound3.load();
    sound4.load();
});
