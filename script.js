const PHASES = [
    {
        name: "TITLE",
        duration: 15,
        enter: () => {
            whiteScreen();
            hideTitle();
        }
    },

    {
        name: "WHITE1",
        duration: 60,
        enter: () => {
            whiteScreen();
        }
    },

    {
        name: "BLACK1",
        duration: 30,
        enter: () => {
            blackScreen();
        }
    },

    {
        name: "WHITE2",
        duration: 300,
        enter: () => {
            whiteScreen();
            startBreathing();
        }
    },

    {
        name: "BLACK_AFTER_WHITE2",
        duration: 30,
        enter: () => {
            stopBreathing();
            blackScreen();
        }
    },

    {
        name: "LIGHT_BLUE",
        duration: 300,
        enter: () => {
            setBackground("#d9f2ff");
            hideMessage();
        }
    },

    {
        name: "BLACK_AFTER_RANDOM",
        duration: 30,
        enter: () => {
            blackScreen();
        }
    },

    {
        name: "RANDOM",
        duration: 300,
        enter: () => {
            playBell();
            startRandomColors();
        }
    },

    {
        name: "FINAL",
        duration: 120,
        enter: () => {
            stopRandomColors();
            whiteScreen();
            startRandomSounds();
        }
    }
];

let phaseIndex = 0;
let phaseStartTime = 0;

function startPerformance(){

    if(running) return;

    running = true;
    startTime = Date.now();

    phaseIndex = 0;
    phaseStartTime = Date.now();

    startScreen.style.display = "none";

    enterPhase();
    rafLoop();
}

function enterPhase(){

    const phase = PHASES[phaseIndex];

    if(!phase) return;

    setState(phase.name);
    phase.enter();
}
function rafLoop(){

    if(!running) return;

    const now = Date.now();
    const phase = PHASES[phaseIndex];

    if(!phase){
        endPerformance();
        return;
    }

    const elapsed = (now - phaseStartTime) / 1000;

    if(elapsed >= phase.duration){

        phaseIndex++;

        if(phaseIndex >= PHASES.length){
            endPerformance();
            return;
        }

        phaseStartTime = now;
        enterPhase();
    }

    rafId = requestAnimationFrame(rafLoop);
}

function nextPhase(){

    if(!running){
        startPerformance();
        return;
    }

    phaseIndex++;

    if(phaseIndex >= PHASES.length){
        endPerformance();
        return;
    }

    phaseStartTime = Date.now();
    enterPhase();
}

function prevPhase(){

    if(phaseIndex <= 0) return;

    phaseIndex -= 2;
    if(phaseIndex < 0) phaseIndex = 0;

    phaseStartTime = Date.now();
    enterPhase();
}
