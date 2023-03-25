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
    document.querySelector('.pacman').classList.toggle('huge-pacman');
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
}
