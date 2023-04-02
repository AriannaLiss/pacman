import { fieldSize, unit } from "./field.js";
import { field, ghosts } from "./index.js";
import { loose, win } from "./methods.js";
import { Point } from "./point.js";

export class Pacman{
    #position; 
    #boy = true;
    #flow = false;
    #futureDirection = '';
    #moving = false;
    #speed = 150;
    #pacman;
    #pacmanHtml = () => {
        return `<div class="pacman">
                    <div class="pacman-top">
                        <div class="pacman-bow ${this.#boy ? 'hide' : ''}"><span></span><span></span></div>
                    </div>
                    <div class="pacman-bottom"></div>
                </div>`
    }
    #createPacmanTag(){
        const pacman = document.createElement('div');
        const pacmanTop = document.createElement('div');
        const pacmanBow = document.createElement('div');
        const pacmanBottom = document.createElement('div');
        pacman.classList.add('pacman');
        pacmanTop.classList.add('pacman-top');
        pacmanBow.classList.add('pacman-bow');
        pacmanBow.innerHTML = '<span></span><span></span>';
        if(this.#boy)pacmanBow.classList.add('hide');
        pacmanBottom.classList.add('pacman-bottom');
        pacmanTop.appendChild(pacmanBow);
        pacman.appendChild(pacmanTop);
        pacman.appendChild(pacmanBottom);
        pacman.position='absolute';
        pacman.style.width = fieldSize + unit;
        pacman.style.height = fieldSize + unit;
        pacman.style.transitionDuration=this.#speed/3+'ms';
        return pacman;
    }

    createPacman(tag){
        this.#moving = false;
        this.#futureDirection = '';
        this.#position = new Point(tag.dataset.x, tag.dataset.y);
        if (!this.#pacman) this.#pacman = this.#createPacmanTag();
        this.#movePacman(this.#position);
        document.querySelector('.container').appendChild(this.#pacman);
    }

    #movePacman(position){
        this.#pacman.style.top = `${3+position.y*fieldSize+unit}`;
        this.#pacman.style.left = `${5+position.x*fieldSize+unit}`;
    }

    isFlow(){
        return this.#flow;
    }

    switchFlow(){
        if(this.#flow){
            this.#flow = false
            this.#pacman.style.transitionDuration=this.#speed/3+'ms';
        } else {
            this.#flow = true;
            this.#pacman.style.transitionDuration=this.#speed+'ms';
        } 
    }

    isBoy(){
        return this.#boy;
    }

    switchGender(){
        this.#boy ? this.#boy = false: this.#boy = true;
    }

    getCurrentTagField(){
        return field.getTagField(this.#position);
    }

    getCurrentField(){
        return field.getField(this.#position);
    }

    get currentPosition(){
        return this.#position;
    }

    startMove(direction){
        if (this.#futureDirection === direction) return;
        this.#moving ?
        this.#futureDirection = direction :
        this.#move(direction);
    }

    rotate(){
        let i=1;
        const rotationIntervalID = setInterval(()=>{
            this.#pacman.style.transform=`rotate(${0.25*i++}turn)`;
            if(i==12) clearInterval(rotationIntervalID);
        },100)
    }

    stop(){
        this.#futureDirection = '';
        this.#moving = false;
    }

    #move(direction){
        this.#moving = true;
        if (this.#futureDirection &&
            this.#futureDirection!=direction && 
            field.getField(this.getNewPostion(this.#futureDirection))>=0){
            if (this.#flow) setTimeout( () => this.#move(this.#futureDirection), this.#speed);
            return;
        }
        const potentialPosition = this.getNewPostion(direction);
        const nextField = field.getField(potentialPosition);
        if (nextField<0) {
            this.stop();
            return;
        }
        if (nextField == 1 || nextField == 2){
            setTimeout(()=>field.eatDot(potentialPosition),this.#speed/2);
        }
        if (nextField == 2){
            ghosts.forEach(ghost => ghost.beKind())
        }
        this.#repaint(potentialPosition);
        this.#rotateHead(direction);

        if (this.#looseWinTest()) { 
            return;
        }
        this.#flow ? setTimeout( () => this.#move(direction), this.#speed) : this.stop();
    }

    #repaint(position){
       this.#position.move(position);
        this.#movePacman(position);
    }

    #looseWinTest(){
        let gameOver = false;
        if (field.isFinish()){
            win();
            gameOver = true;
        }
        ghosts.forEach(ghost => {if(ghost.currentPosition.isEqual(this.currentPosition)) {
            if (ghost.angry) { 
                loose();
                gameOver = true;
            }
            else {
                ghost.backHome(); 
                gameOver = false;
            }
        }})
        return gameOver;
    }

    #rotateHead(direction){
        if(direction == 'left'){
            this.#pacman.style.transform = 'scaleX(-1)';
        } else if(direction == 'up'){
            this.#pacman.style.transform = 'rotate(270deg)';
        } else if(direction == 'down'){
            this.#pacman.style.transform = 'rotate(90deg)';
        } else if(direction == 'right'){
            this.#pacman.style.transform = 'none';
        }
    }

    getNewPostion(direction){
        const position = new Point(this.#position.x, this.#position.y)
        if (this.getCurrentField() == 5 && ((this.#position.x == 0 && direction == 'left')||(this.#position.x > 0 && direction == 'right'))) {
                position.move(field.teleport(position))
        } else {
            position.moveDir(direction);
        }
        return position;
    }
}
