import { changePacmanSize } from "./events.js";
import { fieldSize, unit } from "./field.js";
import { field, ghosts } from "./index.js";
import { loose, win } from "./methods.js";
import { Point } from "./point.js";

export class Pacman{
    #position; 
    #boy = false;
    #flow = true;
    #futureDirection = '';
    #superPower;
    #moving = false;
    #speed = 100;
    #pacman;
    #teleport = false;
    #stopSign = false;
    #angryTimer;

    #createPacmanTag(){
        const pacman = document.createElement('div');
        const pacmanTop = document.createElement('div');
        const pacmanBow = document.createElement('div');
        const pacmanBottom = document.createElement('div');
        let teeth = '';
        for (let i=0;i<4;i++) teeth += '<span class="tooth"></span>';
        pacman.classList.add('pacman');
        pacmanTop.classList.add('pacman-top');
        pacmanBow.classList.add('pacman-bow');
        pacmanBow.innerHTML = '<span></span><span></span>';
        if(this.#boy)pacmanBow.classList.add('hide');
        pacmanBottom.classList.add('pacman-bottom');
        pacmanBottom.innerHTML = '<div class="jowl hide bottom-jowl">' + teeth + '</div>';
        pacmanTop.appendChild(pacmanBow);
        pacmanTop.innerHTML += '<span class="pacman-eye hide"></span><div class="jowl hide  hide top-jowl">' + teeth + '</div>';
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
        this.#stopSign = false;
        this.#position = new Point(tag.dataset.x, tag.dataset.y);
        if (!this.#pacman) this.#pacman = this.#createPacmanTag();
        this.#pacman.classList.remove('hide');
        this.#pacman.style.transitionDuration=this.#speed+'ms';
        this.#movePacman(this.#position);
        document.querySelector('.container').appendChild(this.#pacman);
    }

    hide(){   
        const blinkIntervalID = setInterval(() => {
            this.#pacman.classList.toggle('hide');
        }, 80);
        setTimeout(()=> {
            clearInterval(blinkIntervalID);
            this.#pacman.classList.add('hide');
        }, 600);
    }

    #movePacman(position){
        if (this.#teleport){
            this.#pacman.classList.add('hide');
        }
        this.#pacman.style.top = `${3+position.y*fieldSize+unit}`;
        this.#pacman.style.left = `${5+position.x*fieldSize+unit}`;
        if (this.#teleport){
            setTimeout(() => this.#pacman.classList.remove('hide'),30);
            this.#teleport = false;
        }
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

    switchSuper(){
        this.#superPower = !this.#superPower;
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
        // if (this.#boy) {
        //     return this.break();
        // }
        let i=1;
        const rotationIntervalID = setInterval(()=>{
            this.#pacman.style.transform=`rotate(${0.25*i++}turn)`;
            if(i===9) {
                clearInterval(rotationIntervalID);
            }
        },100)
        return rotationIntervalID;
    }
    
    break(){
        let i=0;
        console.log(this.#pacman)
        const top = this.#pacman.querySelector(".pacman-top");
        const bottom = this.#pacman.querySelector(".pacman-bottom");
        this.#pacman.style.transform=`rotate(0.75turn)`;
        
        const rotationIntervalID = setInterval(()=>{
            bottom.style.transform=`rotate(${0.05*i++}turn)`;
            top.style.transform=`rotate(${0.05*(-i)}turn)`;
            
            if(i==10) {
                clearInterval(rotationIntervalID);
            }
        },100)
        return rotationIntervalID
    }

    #beAngry(){
        changePacmanSize();
        if(this.#boy){
            document.querySelectorAll('.jowl').forEach(jowl => jowl.classList.remove('hide'));
            document.querySelectorAll('.pacman-eye').forEach(jowl => jowl.classList.remove('hide'));
        }
        if (this.#angryTimer) clearTimeout(this.#angryTimer);
        this.#angryTimer = setTimeout(() => this.#beKind(),field.kindnessTime * 1.25);
    }
    
    #beKind(){  
        changePacmanSize(false);
        if (this.#angryTimer) clearTimeout(this.#angryTimer);
        this.#angryTimer = undefined;
        document.querySelectorAll('.jowl').forEach(jowl => jowl.classList.add('hide'));
        document.querySelectorAll('.pacman-eye').forEach(jowl => jowl.classList.add('hide'));
    }

    #stop(){
        this.#futureDirection = '';
        this.#moving = false;
    }

    gameOver(){
        this.#stop();
        this.#stopSign = true;
        this.#beKind();
    }

    #move(direction){
        if (this.#stopSign) return;
        this.#moving = true;
        const newField= field.getField(this.getNewPostion(this.#futureDirection));
        if (this.#futureDirection &&
            this.#futureDirection!=direction && 
            (newField>=0||(this.#superPower&&newField<-10))){
            if (this.#flow) setTimeout( () => this.#move(this.#futureDirection), this.#speed);
            return;
        }
        const potentialPosition = this.getNewPostion(direction);
        const nextField = field.getField(potentialPosition);
        if ((this.#superPower&&nextField<0&&nextField>-10) || (!this.#superPower&&nextField<0)) {
            this.#stop();
            return;
        }
        if (nextField == 1){
            setTimeout(()=>field.eatDot(potentialPosition),this.#speed/2);
        }
        if (nextField == 2){
            setTimeout(()=>field.eatGreatDot(potentialPosition),this.#speed/2);
            ghosts.forEach(ghost => ghost.beKind())
            this.#beAngry();
        }
        this.#repaint(potentialPosition);
        this.#rotateHead(direction);

        if (this.#looseWinTest()) { 
            return;
        }
        this.#flow ? setTimeout( () => this.#move(direction), this.#speed) : this.#stop();
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
            position.move(field.teleport(position));
            this.#teleport = true;
        } else {
            position.moveDir(direction);
        }
        return position;
    }
}
