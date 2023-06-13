import { checkKey, girlBoySwitch, newGame, resetColor, speedSwitch, superPacman, switchPlayground, switchTheme } from "./events.js";
import { fieldSize, unit } from "./field.js";
import { field, ghosts, pacman } from "./index.js";

export const win = () => {
    stopCreatures();
    ghosts.forEach((ghost) => {
        ghost.cleanIntervals();
        ghost.blink();
    })
    setTimeout(()=>ghosts.forEach((ghost) => ghost.erise()),1200);
    newGame('Congratulates!!!!');
}

export const loose = () => {
    stopCreatures();
    const interval = pacman.rotate();
    setTimeout(() => {
        clearInterval(interval);
        pacman.hide()
    }, 1000);
    newGame('You lose :(');
}

export const stopCreatures = () => {
    pacman.gameOver();
    ghosts.forEach((ghost) => ghost = ghost.freeze());
}

export const createRadioTheme = () => {
    const form = document.createElement('form');
    form.insertAdjacentHTML('beforeend','<p>You can adjust your game</p>');
    const flexCont = document.createElement('div');
    flexCont.classList.add('flex-container');
    const colorDiv = document.createElement('div');
    colorDiv.appendChild(createOption('red','theme_color'));
    colorDiv.appendChild(createOption('magenta','theme_color'));
    colorDiv.appendChild(createOption('black','theme_color', true));
    colorDiv.appendChild(createOption('pink','theme_color',false, resetColor));
    
    const switchersDiv = document.createElement('div');
    switchersDiv.appendChild(createSwithcer("genderSwitcher","genderSwitcherText",'GIRL', girlBoySwitch));
    switchersDiv.appendChild(createSwithcer("speedSwitcher","speedSwitcherText",'flow', speedSwitch));

    const selectField = document.createElement('select');
    selectField.classList.add('pg-select');
    selectField.addEventListener('change', () => switchPlayground(selectField.value));
    field.fieldMaps.forEach((fieldName,i) => {
        selectField.innerHTML += `<option value='${i}'>${fieldName}</option>`
    })
    switchersDiv.appendChild(selectField);
    
    flexCont.appendChild(colorDiv);
    flexCont.appendChild(makeSuperPowerBtn());
    flexCont.appendChild(switchersDiv);

    form.appendChild(flexCont);
    document.querySelector('.header').appendChild(form);
}

const createSwithcer = (inputId, labelId, text, switchHandler) => {
    const switcher = document.createElement('div');
    switcher.classList.add('switch-container');
    const label = document.createElement('label');
    label.classList.add('switch');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = inputId;
    const span = document.createElement('span');
    span.classList.add('slider');
    span.classList.add('round');
    const labelText = document.createElement('label');
    input.addEventListener('click', switchHandler);
    label.appendChild(input);
    label.appendChild(span);
    switcher.appendChild(label);

    labelText.innerText=text;
    labelText.id = labelId;
    labelText.htmlFor= inputId;
    switcher.appendChild(labelText);
    return switcher;
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

function makeSuperPowerBtn(){
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.id = 'makeSuperPower';
    btn.value = 'Super';
    btn.classList.add('disabled-btn');
    btn.addEventListener('click', (e) => superPacman(e.target));
    return btn
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
        '-4':'ghost-place',
        '-11':'blue',
        '-12':'yellow',
        '-13':'red',
        '-14':'green',
        '-15':'pink',
    }
    const pg = [];
    field.clearIntervals();
    getText('playgrounds/'+field.fieldMap+'.pg')
    .then(text => {
        text.split('\n').forEach((str,i) => pg[i]=str.split('\t'));
        let container = document.querySelector('.container');
        container.innerHTML = '';
        container.style.width = fieldSize * pg[0].length + unit;
        pg.forEach((row,y) =>
            row.forEach((f,x) => {
            const span = document.createElement('div');
            span.classList.add('field');
            span.classList.add(FIELDS[f]);
            if(f<-10){span.classList.add(FIELDS[-1])}
            if (FIELDS[f]=='great-dot'){
                span.dataset.interval = setInterval(() => toggle(span),200)
                field.intervals.push(span.dataset.interaval);
            }
            span.dataset.x = x;
            span.dataset.y = y;
            span.style.width = fieldSize + unit;
            span.style.height = fieldSize + unit;
            container.appendChild(span);
        }));

        field.init(pg);

        document.addEventListener('keydown', checkKey);
        
        createPacman();
        createGhosts();
    });
}

const toggle = (span) => {
    span.classList.toggle('great-dot');
}

const createPacman = () =>{
    pacman.createPacman(document.querySelector('.pacman-place'));
}

const createGhosts = () =>{
    const [...ghostPlaces] = document.querySelectorAll('.ghost-place');
    ghosts.forEach((ghost,i) => {
        const place = (ghostPlaces.length-1)%(i+1);
        ghost.create(ghostPlaces[place])
    }
    )
}

async function getText(file) {
    const data = await fetch(file)
    return await data.text();
}
