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
        document.querySelector('.pacman-bow').style.top = '-15%'
        document.querySelectorAll('.pacman-bow>span').forEach((span)=>{span.style.transform = 'scale(20)'});
    } else {
        document.querySelector('.pacman-bow').style.top = '-40%'
        document.querySelectorAll('.pacman-bow>span').forEach((span)=>{span.style.transform = 'scale(1)'});
    }
}

export function checkKey(e) {
    e = e || window.event;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        pacman.move(e.code.substr(5).toLowerCase());
        e.preventDefault();
    }
}

export const girlBoySwitch = () => {
    document.querySelector('.pacman-bow').classList.toggle('hide');
    pacman.switchGender();
    document.querySelector('#genderSwitcherText').innerText = pacman.isBoy() ? 'BOY' : 'GIRL'
}
