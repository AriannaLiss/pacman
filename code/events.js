import { pacman } from "./index.js";

const DEF_BG = 'rgba(239, 141, 227, 0.935)';

export const switchTheme = (e) => {
    if (e.target.checked) {
        document.querySelector('.container').style.backgroundColor = e.target.id;
    }
}

export const resetColor = (e) => {
    if (e.target.checked) {
        document.querySelector('.container').style.backgroundColor = DEF_BG;
    }
}

export const changePacmanSize = () => {
    const pacTag = document.querySelector('.pacman');
    pacTag.classList.toggle('huge-pacman');
    if(pacTag.classList.contains('huge-pacman')) {
        document.querySelectorAll('.pacman-bow>span').forEach((span)=>{span.style.transform = 'scale(2)'});
    } else {
        document.querySelectorAll('.pacman-bow>span').forEach((span)=>{span.style.transform = 'scale(1)'});
    }
}

export const superPacman = () => {
    pacman.switchSuper();
}

export function checkKey(e) {
    e = e || window.event;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        pacman.startMove(e.code.substr(5).toLowerCase());
        e.preventDefault();
    }
}

export const girlBoySwitch = () => {
    document.querySelector('.pacman-bow').classList.toggle('hide');
    pacman.switchGender();
    document.querySelector('#genderSwitcherText').innerText = pacman.isBoy() ? 'BOY' : 'GIRL'
}

export const speedSwitch = () => {
    pacman.switchFlow();
    document.querySelector('#speedSwitcherText').innerText = pacman.isFlow() ? 'flow' : 'push'
}
