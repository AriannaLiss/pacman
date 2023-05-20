import { field, pacman } from "./index.js";
import { loose } from "./methods.js";
import { Point } from "./point.js";

const colorList=['clyde', 'inky', 'pinky', 'blinky'];

export class Ghost{
    #position; 
    #color
    #angry = true;
    #futureDirection = 'up';
    #speed = 500;
    #inCage = true;
    #exitDirection = 'up';
    #sameDirection = 0;
    #startPos;
    #stop = false;
    #blinkIntervalID;
    #blinkTimeoutID;
    #kindTimeoutID;
    #kindnessTime=10000;

    constructor(color){
        this.#color = colorList[color];
    }

    init(){
        this.#inCage = true;
        this.#angry = true;
        this.#futureDirection = 'up';
        this.#sameDirection = 0;
        this.#stop = false;
        this.#cleanIntervals();
    }

    freeze(){
        this.#stop = true;
        this.#angry = true;
    }

    beKind(){
        this.#cleanIntervals();
        this.#angry = false;
        this.#kindTimeoutID = setTimeout(() => this.blink(), this.#kindnessTime);
    }

    #cleanIntervals(){
        if (this.#blinkIntervalID) clearInterval(this.#blinkIntervalID);
        if (this.#blinkTimeoutID) clearTimeout(this.#blinkTimeoutID);
        if (this.#kindTimeoutID) clearTimeout(this.#kindTimeoutID);
    }

    blink(){
        this.#blinkIntervalID = setInterval(() => {
            document.getElementsByClassName(this.#color)[0]?.classList.toggle('kind-ghost');
        }, this.#kindnessTime/40);
        this.#blinkTimeoutID = setTimeout(()=> {
            clearInterval(this.#blinkIntervalID);
            this.#angry = true;
        }, this.#kindnessTime/4);
    }

    get angry(){
        return this.#angry;
    }

    #kindness(){
        let kindness = ''
        if(!this.#angry) kindness = 'kind-ghost'
        return kindness
    }

    #ghostHtml = () => {
        return `
        <div class="ghost ${this.#color} ${this.#kindness()}">
        <div class="eyes">
          <div class="eye leftEye"><div class="iris"></div></div>
          <div class="eye rightEye"><div class="iris"></div></div>
        </div>
        <div class="ghostTail"></div>
      </div>`
    }

    create(tag){
        this.init();
        tag.innerHTML = this.#ghostHtml();
        this.#position = new Point(tag.dataset.x, tag.dataset.y);
        this.#startPos = new Point(tag.dataset.x, tag.dataset.y);
        this.startMove();
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

    startMove(){
        this.#move(this.#randomMove());
    }

    #randomMove(oldDir){
        const directions = ['up', 'right', 'down', 'left'];
        let direction
        // if(this.#position.y == 1 && directions.includes(oldDir)%2 != 0) {
        //     direction = 'down';
        // } else if(this.#position.y == field.bottom && directions.includes(oldDir)%2 != 0 ) {
        //     direction = 'up';
        // } else {
            do{
                direction = directions[Math.floor(Math.random()*4)];
            }while(direction == oldDir 
                // || (this.#position.y == 1 && direction == 'up')
                // || (this.#position.y == field.bottom && direction == 'down')
                ||(this.#sameDirection>=10 && directions.indexOf(oldDir)%2 == directions.indexOf(direction)%2)
            )
        // }
        this.#sameDirection = 0;
        return direction
    }

    #appropriateField(field){
        return !(field==-1 || field==-2 || field<-10 || (!this.#inCage && field ==-3));
    }

    backHome(){
        this.freeze();
        setTimeout(()=>{
            this.erise();
            this.#position.move(this.#startPos);
            setTimeout(() => {
                this.init();
                this.startMove()
            }, this.#kindnessTime);  
        }, 100)
    }

    #move(direction){
        if (this.#stop) return;
        if (this.#changeDirection(direction)) return;

        const potentialPosition = this.getNewPostion(direction);
        const nextField = field.getField(potentialPosition);

        if (!this.#appropriateField(nextField)) {
            if(this.#inCage && (this.#position.y<=field.exitY[0])){
                this.#futureDirection = this.#randomMove(direction);
                this.#inCage = false;
            }
            this.#move(this.#randomMove(direction));
            return;
        }

        if (this.#sameDirection>10){
            this.#move(this.#randomMove());
            return;
        }

        this.#repaint(potentialPosition);
        this.#moveEyes(direction);

        if (this.#looseWinTest()) return;

        setTimeout( () => this.#move(direction), this.#speed);
    }

    #looseWinTest(){
        let stop = false;
        if (pacman.currentPosition.isEqual(this.#position)){
            this.#angry ? loose() : this.backHome();
            stop = true;
        }
        return stop
    }

    #changeDirection(direction){
        if (!this.#inCage &&
            this.#futureDirection!=direction && 
            this.#appropriateField(field.getField(this.getNewPostion(this.#futureDirection)))){
                setTimeout( () => this.#move(this.#futureDirection), this.#speed);
                this.#futureDirection = this.#randomMove(direction);
                return true;
        }

        if(this.#inCage && direction != this.#exitDirection && field.exitX.includes(this.#position.x)){
            setTimeout( () => this.#move(this.#exitDirection), this.#speed);
            return true;
        }

        return false;
    }

    erise(){
        const ghost = document.querySelector('.'+this.#color);
        if(ghost?.parentNode){
            ghost.parentNode.removeChild( ghost );
        }
    }

    #repaint(position){
        this.erise();
        this.#position.move(position);
        const newPosition = this.getCurrentTagField();
        newPosition.innerHTML = this.#ghostHtml();
        this.#sameDirection++;
    }


    #moveEyes(direction){
        const ghost = document.querySelector('.'+this.#color);
        const leftIris = ghost.querySelector('.leftEye>.iris');
        const rightIris = ghost.querySelector('.rightEye>.iris');
        if(direction == 'left'){
            leftIris.style.left = 0;
            rightIris.style.right = '1px';
        } else if(direction == 'up'){
            leftIris.style.top = 0;
            rightIris.style.top = 0;
        } else if(direction == 'down'){
            leftIris.style.top = '2px';
            rightIris.style.top = '2px';
        } else if(direction == 'right'){
            leftIris.style.left = '1px';
            rightIris.style.right = 0;
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
