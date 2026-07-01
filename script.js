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

function startRandomSounds(){
    stopRandomSounds();

    const loop = () => {
        if(!running) return;

        const wait = random(SOUND_MIN, SOUND_MAX);

        const id = setTimeout(() => {
            playRandomSound();
            loop();
        }, wait * 1000);

        addTimer(id);
    };

    loop();
}
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
//==================================================
// PART 5: 呼吸・タイマー系ループ
//==================================================


//==============================
// 呼吸ループ（安定化版）
//==============================
function breathingLoop(){

    if(!running) return;

    const wait = random(20, 60);

    const id = setTimeout(() => {

        if(!running) return;

        background.classList.add("breath");

        const inner = setTimeout(() => {

            background.classList.remove("breath");

            breathingLoop();

        }, 10000);

        addTimer(inner);

    }, wait * 1000);

    addTimer(id);
}


//==============================
// 呼吸開始
//==============================
function startBreathing(){

    stopBreathing();
    breathingLoop();
}


//==============================
// 呼吸停止（完全停止版）
//==============================
function stopBreathing(){

    // 全タイマー削除で完全停止
    clearAllTimers();

    background.classList.remove("breath");
}
//==================================================
// PART 6: メインエンジン（rafLoop安定化）
//==================================================


//==============================
// 状態設定
//==============================
function setState(s){
    if(state === s) return; // 無駄ログ・再実行防止
    state = s;
    console.log("STATE:", state);
}


//==============================
// メインループ
//==============================
function rafLoop(){

    if(!running) return;

    const t = (Date.now() - startTime) / 1000;

    const t1 = TITLE_TIME;
    const t2 = t1 + WHITE1_TIME;
    const t3 = t2 + BLACK1_TIME;
    const t4 = t3 + WHITE2_TIME;
    const t5 = t4 + RANDOM_COLOR_TIME;
    const t6 = t5 + BLACK2_TIME;
    const t7 = t6 + FINAL_TIME;


    //==========================
    // TITLE
    //==========================
    if(t < t1){

        setState("TITLE");

    }

    //==========================
    // WHITE1
    //==========================
    else if(t < t2){

        setState("WHITE1");
        whiteScreen();

    }

    //==========================
    // BLACK1
    //==========================
    else if(t < t3){

        setState("BLACK1");
        blackScreen();

    }

    //==========================
    // WHITE2 + 呼吸
    //==========================
    else if(t < t4){

        if(state !== "WHITE2"){
            setState("WHITE2");
            whiteScreen();
            startBreathing();
        }
    }

    //==========================
    // RANDOM COLOR + bell
    //==========================
    else if(t < t5){

        if(state !== "RANDOM"){
            setState("RANDOM");
            stopBreathing();
            playBell();
            startRandomColors();
        }
    }

    //==========================
    // BLACK2
    //==========================
    else if(t < t6){

        if(state !== "BLACK2"){
            setState("BLACK2");
            stopRandomColors();
            blackScreen();
            playSound1();
        }
    }

    //==========================
    // FINAL
    //==========================
    else if(t < t7){

        if(state !== "FINAL"){
            setState("FINAL");
            whiteScreen();
            startRandomSounds();
        }
    }

    //==========================
    // END
    //==========================
    else {
        endPerformance();
        return;
    }

    rafId = requestAnimationFrame(rafLoop);
}

//==================================================
// PART 7: 操作・緊急停止・イベント
//==================================================


//==============================
// 終了処理（共通化）
//==============================
function stopAll(){

    running = false;

    cancelAnimationFrame(rafId);

    clearAllTimers();

    // 音停止
    const allSounds = [bell, sound1, sound2, sound3, sound4];

    allSounds.forEach(a => {
        if(!a) return;
        a.pause();
        a.currentTime = 0;
    });

    // UIリセット
    background.classList.remove("breath");
    whiteScreen();

    startScreen.style.display = "flex";

    setState("IDLE");
}


//==============================
// 終了
//==============================
function endPerformance(){
    stopAll();
    alert("作品が終了しました");
}


//==============================
// 緊急停止
//==============================
function emergencyStop(){
    stopAll();
    console.log("EMERGENCY STOP");
}


//==============================
// リセット
//==============================
function resetPerformance(){
    phaseIndex = 0;
    stopAll();
    console.log("RESET");
}


//==============================
// フェーズ管理
//==============================
const phases = [
    "TITLE",
    "WHITE1",
    "BLACK1",
    "WHITE2",
    "RANDOM",
    "BLACK2",
    "FINAL"
];

let phaseIndex = 0;


//==============================
// 次フェーズ
//==============================
function nextPhase(){

    if(!running){
        running = true;
        phaseIndex = 0;
    }

    if(phaseIndex < phases.length){
        runPhase(phases[phaseIndex]);
        phaseIndex++;
    } else {
        endPerformance();
    }
}


//==============================
// 前フェーズ
//==============================
function prevPhase(){

    if(phaseIndex <= 1) return;

    phaseIndex -= 2;

    if(phaseIndex < 0) phaseIndex = 0;

    runPhase(phases[phaseIndex]);

    phaseIndex++;
}


//==============================
// フェーズ実行
//==============================
function runPhase(phase){

    console.log("PHASE:", phase);

    switch(phase){

        case "TITLE":
            whiteScreen();
            hideTitle();
            break;

        case "WHITE1":
            whiteScreen();
            break;

        case "BLACK1":
            blackScreen();
            break;

        case "WHITE2":
            whiteScreen();
            startBreathing();
            break;

        case "RANDOM":
            stopBreathing();
            playBell();
            startRandomColors();
            break;

        case "BLACK2":
            stopRandomColors();
            blackScreen();
            playSound1();
            break;

        case "FINAL":
            whiteScreen();
            startRandomSounds();
            break;
    }
}


//==============================
// スタート
//==============================
function startPerformance(){

    if(running) return;

    running = true;
    startTime = Date.now();

    phaseIndex = 0;

    setState("TITLE");

    startScreen.style.display = "none";

    whiteScreen();

    hideTitle();

    rafLoop();
}


//==============================
// イベント
//==============================

// キー操作（windowに統一）
window.addEventListener("keydown", (e) => {

    console.log("KEY:", e.key);

    if(e.key === " " || e.key === "Enter"){
        e.preventDefault();

        if(!running){
            startPerformance();
        } else {
            nextPhase();
        }
    }

    if(e.key === "ArrowLeft"){
        prevPhase();
    }

    if(e.key === "r" || e.key === "R"){
        resetPerformance();
    }

    if(e.key === "Escape"){
        emergencyStop();
    }
});


//==============================
// ボタン操作
//==============================
startButton.addEventListener("click", () => {
    unlockAudio();
    startPerformance();
});


//==============================
// 音ロード
//==============================
window.addEventListener("load", () => {
    initAudio();
});
