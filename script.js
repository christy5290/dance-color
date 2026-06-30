// ===== 設定 =====

// 色が変わる間隔（30〜60秒）
const COLOR_MIN = 30000;
const COLOR_MAX = 60000;

// 効果音の間隔（1〜3分）
const SOUND_MIN = 60000;
const SOUND_MAX = 180000;

// ベル
const bell = new Audio("bell.mp3");

// 最後に流す音
const sounds = [
    new Audio("sound1.mp3"),
    new Audio("sound2.mp3"),
    new Audio("sound3.mp3"),
    new Audio("sound4.mp3")
];

// ===== 色 =====

function randomColor(){

    const r = Math.floor(Math.random()*256);
    const g = Math.floor(Math.random()*256);
    const b = Math.floor(Math.random()*256);

    document.body.style.backgroundColor =
        `rgb(${r},${g},${b})`;

}

// ===== ランダム時間 =====

function randomTime(min,max){
    return Math.random()*(max-min)+min;
}

// ===== 色変更開始 =====

function startRandomColor(){

    const endTime = Date.now()+5*60*1000;

    function change(){

        if(Date.now()>endTime){

            document.body.style.backgroundColor="white";
            startRandomSound();

            return;
        }

        randomColor();

        setTimeout(change,randomTime(COLOR_MIN,COLOR_MAX));

    }

    change();

}

// ===== 音 =====

function startRandomSound(){

    const endTime = Date.now()+10*60*1000;

    function play(){

        if(Date.now()>endTime){

            return;

        }

        const sound =
            sounds[Math.floor(Math.random()*sounds.length)];

        sound.currentTime=0;
        sound.play();

        setTimeout(play,randomTime(SOUND_MIN,SOUND_MAX));

    }

    play();

}

// ===== 開始 =====

// 最初は白
document.body.style.backgroundColor="white";

// 15分後
setTimeout(()=>{

    bell.play();

    startRandomColor();

},15*60*1000);
