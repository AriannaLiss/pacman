import { changePacmanSize, checkKey, resetColor, switchTheme } from "./events.js";
import { field, pacman } from "./index.js";

const fieldSize = 1;
const unit = 'rem';

export const createRadioTheme = () => {
    const form = document.createElement('form');
    form.insertAdjacentHTML('beforeend','<p>Please select your favorite color:</p>');
    form.appendChild(createOption('red','theme_color'));
    form.appendChild(createOption('magenta','theme_color'));
    form.appendChild(createOption('black','theme_color'));
    form.appendChild(createOption('defaultColor','theme_color',true, resetColor));
    document.querySelector('body').appendChild(form);
    makePacmanBigBtn();
}

const createOption = (id, radioGroup, checked = false,event = switchTheme) => {

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.id = id;
    radio.name = radioGroup;
    radio.value = id;
    radio.checked = checked;
    radio.addEventListener('click', event);

    const label = document.createElement('label');
    label.htmlFor = id;
    label.value = id;
    label.name = radioGroup;
    label.innerText = id;
    label.classList.add(id);

    const div = document.createElement('div');
    div.appendChild(radio);
    div.appendChild(label);

    return div;
}

function makePacmanBigBtn(){
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.value = 'Make huge pacman';
    btn.addEventListener('click', changePacmanSize);
    document.querySelector('form').appendChild(btn);
}

export function createPlayground(){
    const FIELDS = {
        0:'empty',
        1:'dot',
        2:'great-dot',
        3:'fruit',
        4:'pacman-place',
        5:'portal',
        '-1':'border',
        '-2':'double-border',
        '-3':'door',
        '-4':'monster-place'
    }
     const pg = [];
    getText('./code/playground.txt')
    .then(text => {
        text.split('\n').forEach((str,i) => pg[i]=str.split('\t'));
        let container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '';
        } else {
            container = document.createElement('div');
            container.classList.add('container');
            container.style.width = fieldSize * pg[0].length + unit;
        }
        pg.forEach((row,y) =>
            row.forEach((f,x) => {
            const span = document.createElement('div');
            span.classList.add('field');
            span.classList.add(FIELDS[f]);
            span.dataset.x = x;
            span.dataset.y = y;
            span.style.width = fieldSize + unit;
            span.style.height = fieldSize + unit;
            container.appendChild(span);
        }));

        field.init(pg);

        document.addEventListener('keydown', checkKey);

        document.querySelector('body').appendChild(container);
        pacman.createPacman(document.querySelector('.pacman-place'));
    });
}

async function getText(file) {
    const data = await fetch(file)
    return await data.text();
}
