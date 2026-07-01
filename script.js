//==================================================
// 身体の可能性（改修版：安定化エンジン）
// PART 1: 基本設定
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

// タイマー管理（安全化）
let timers = [];

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

// タイマー管理追加
function addTimer(id){
    timers.push(id);
}

function clearAllTimers(){
    timers.forEach(clearTimeout);
    timers = [];
}

//==================================================
// PART 2: 背景・UI・メッセージ
//==================================================


//==============================
// 背景制御
//==============================
function setBackground(color){
    background.style.backgroundColor = color;
}

function blackScreen(){
    hideMessage();
    background.classList.remove("white");
    background.classList.add("black");
    setBackground("#000000");
}

function whiteScreen(){
    hideMessage();
    background.classList.remove("black");
    background.classList.add("white");
    setBackground("#ffffff");
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
    }, 800); // ←1500msは長すぎて残像バグになるので短縮
}


//==============================
// タイトル
//==============================
function hideTitle(){
    if(!titleScreen) return;

    titleScreen.style.opacity = 0;

    setTimeout(() => {
        titleScreen.style.display = "none";
    }, 1000); // ←2000ms → 1000ms（レスポンス改善）
}
//==================================================
// PART 3: 音声システム（安定化）
//==================================================


//==============================
// 共通再生関数（最重要修正）
//==============================
function playAudio(audio){

    if(!audio) return;

    try{
        audio.currentTime = 0;

        const playPromise = audio.play();

        if(playPromise !== undefined){
            playPromise.catch(err => {
                console.log("audio blocked:", err);
            });
        }

    } catch(err){
        console.log("audio error:", err);
    }
}


//==============================
// 個別音
//==============================
function playBell(){
    playAudio(bell);
}

function playSound1(){
    playAudio(sound1);
}


//==============================
// ランダム音
//==============================
function playRandomSound(){
    const audio = randomSounds[random(0, randomSounds.length - 1)];
    playAudio(audio);
}


//==============================
// 初期ロード（安定化）
//==============================
function initAudio(){
    const all = [bell, sound1, sound2, sound3, sound4];

    all.forEach(a => {
        if(!a) return;
        a.load();
        a.volume = 1;
    });
}


//==============================
// ユーザー操作後に音を有効化
//==============================
function unlockAudio(){
    const all = [bell, sound1, sound2, sound3, sound4];

    all.forEach(a => {
        if(!a) return;
        a.play().then(() => {
            a.pause();
            a.currentTime = 0;
        }).catch(() => {
            // 初回はブロックされてもOK
        });
    });
}

//==================================================
// PART 4: シーン・ランダム演出
//==================================================


//==============================
// シーン表示（安全化）
//==============================
function showScene(scene){

    if(!scene) return;

    setBackground(scene.color);

    if(scene.text && scene.text !== ""){
        showMessage(scene.text, scene.textColor || "black");
    } else {
        hideMessage();
    }
}


//==============================
// ランダムシーン
//==============================
function showRandomScene(){

    if(!scenes || scenes.length === 0) return;

    const scene = scenes[random(0, scenes.length - 1)];

    showScene(scene);
}


//==============================
// 色ランダムループ（暴走防止版）
//==============================
function randomColorLoop(){

    if(!running) return;

    showRandomScene();

    const wait = random(COLOR_MIN, COLOR_MAX);

    const id = setTimeout(() => {
        randomColorLoop();
    }, wait * 1000);

    addTimer(id);
}


//==============================
// 開始
//==============================
function startRandomColors(){

    stopRandomColors();
    randomColorLoop();
}


//==============================
// 停止（完全停止版）
//==============================
function stopRandomColors(){

    // 既存タイマー全削除
    clearAllTimers();
}
