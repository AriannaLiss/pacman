import { Field } from "./field.js";
import { Pacman } from "./pacman.js";
import { createPlayground, createRadioTheme } from "./methods.js";

window.addEventListener('DOMContentLoaded',(e) => {
    createPlayground();
    createRadioTheme();
})

export const field = new Field();
export const pacman = new Pacman();