import { changePacmanSize, checkKey, girlBoySwitch, resetColor, speedSwitch, superPacman, switchTheme } from "./events.js";
import { fieldSize, unit } from "./field.js";
import { field, ghosts, pacman } from "./index.js";

export const win = () => {
    stopCreatures();
    ghosts.forEach((ghost) => {
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

const stopCreatures = () => {
    pacman.gameOver();
    ghosts.forEach((ghost) => ghost = ghost.freeze());
}

export const newGame = (msg) => {
    setTimeout(()=>{
        alert(msg);
        createPlayground();
    },1500);
}

export const createRadioTheme = () => {
    const form = document.createElement('form');
    form.insertAdjacentHTML('beforeend','<p>You can adjust your game</p>');
    const flexCont = document.createElement('div');
    flexCont.classList.add('flex-container');
    const colorDiv = document.createElement('div');
    colorDiv.appendChild(createOption('red','theme_color'));
    colorDiv.appendChild(createOption('magenta','theme_color'));
    colorDiv.appendChild(createOption('black','theme_color'));
    colorDiv.appendChild(createOption('defaultColor','theme_color',true, resetColor));
    
    const selectField = document.createElement('select');
    selectField.addEventListener('change', () => {
        console.log(selectField)
        field.setFieldMap(selectField.value)
    });
    selectField.innerHTML = `
        <option value='0'>Squear playground</option>
        <option value='1'>colored Google playground</option>
        <option value='2'>simple Google playground</option>
        `
    colorDiv.appendChild(selectField);
    
    const secondDiv = document.createElement('div');
    secondDiv.appendChild(createSwithcer("genderSwitcher","genderSwitcherText",'GIRL', girlBoySwitch));
    secondDiv.appendChild(createSwithcer("speedSwitcher","speedSwitcherText",'flow', speedSwitch));
    secondDiv.appendChild(makePacmanBigBtn());
    secondDiv.appendChild(makeSuperPowerBtn());

    flexCont.appendChild(colorDiv);
    flexCont.appendChild(secondDiv);
    form.appendChild(flexCont);
    document.querySelector('body').appendChild(form);
}

const createSwithcer = (inputId, labelId, text, switchHandler) => {
//     <label class="switch">
//   <input type="checkbox">
//   <span class="slider round"></span>
// </label>
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

function makePacmanBigBtn(){
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.id = 'makeHuge';
    btn.value = 'HUGE';
    btn.addEventListener('click', changePacmanSize);
    return btn
}

function makeSuperPowerBtn(){
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.id = 'makeSuperPower';
    btn.value = 'Super';
    btn.addEventListener('click', superPacman);
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
    }
    const pg = [];
    field.clearIntervals();
    getText('./code/'+field.fieldMap)
    .then(text => {
        text.split('\n').forEach((str,i) => pg[i]=str.split('\t'));
        let container = document.querySelector('.container');
        if (container) {
            container.innerHTML = '';
            container.style.width = fieldSize * pg[0].length + unit;
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

        document.querySelector('body').appendChild(container);

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
