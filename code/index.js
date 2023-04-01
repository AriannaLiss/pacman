import { Field } from "./field.js";
import { Pacman } from "./pacman.js";
import { createPlayground, createRadioTheme } from "./methods.js";
import { Ghost } from "./ghost.js";


export const field = new Field();
export const pacman = new Pacman();
export const ghosts = [];
for (let i=0; i<3; i++){
    ghosts.push(new Ghost(i));
}

window.addEventListener('DOMContentLoaded',(e) => {
    createPlayground();
    createRadioTheme();
})
