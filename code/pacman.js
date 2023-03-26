import { field } from "./index.js";
import { createPlayground } from "./methods.js";
import { Point } from "./point.js";

export class Pacman{
    #position; 
    #boy = true;
    #flow = false;
    #futureDirection = '';
    #moving = false;
    #pacmanHtml = () => {
        return `<div class="pacman">
                <div class="pacman-top">
                <div class="pacman-bow ${this.#boy ? 'hide' : ''}"><span></span><span></span>
                </div></div>
                <div class="pacman-bottom"></div></div>`
    }

    createPacman(tag){
        tag.innerHTML = this.#pacmanHtml();
        this.#position = new Point(tag.dataset.x, tag.dataset.y);
    }

    isFlow(){
        return this.#flow;
    }

    switchFlow(){
        this.#flow ? this.#flow = false: this.#flow = true;
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

    startMove(direction){
        if (this.#futureDirection === direction) return;
        this.#moving ?
        this.#futureDirection = direction :
        this.#move(direction);
    }

    #stop(){
        this.#futureDirection = '';
        this.#moving = false;
    }

    #move(direction){
        this.#moving = true;
        if (this.#futureDirection &&
            this.#futureDirection!=direction && 
            field.getField(this.getNewPostion(this.#futureDirection))>=0){
            if (this.#flow) setTimeout( () => this.#move(this.#futureDirection), 150);
            return;
        }
        const potentialPosition = this.getNewPostion(direction);
        const nextField = field.getField(potentialPosition);
        if (nextField<0) {
            this.#stop();
            return;
        }
        if (nextField == 1 || nextField == 2){
            field.eatDot(potentialPosition);
        }
        const oldPosition = this.getCurrentTagField();
        oldPosition.innerHTML ='';
        
        this.#position.move(potentialPosition);
        const newPosition = this.getCurrentTagField();
        newPosition.innerHTML = this.#pacmanHtml();
        this.#rotateHead(direction);

        if (field.isFinish()){
            setTimeout(()=>{
                alert('Congratulates!!!!');
                createPlayground();
            },100);
        }
        this.#flow ? setTimeout( () => this.#move(direction), 150) : this.#stop();
    }

    #rotateHead(direction){
        if(direction == 'left'){
            document.querySelector('.pacman').style.transform = 'scaleX(-1)';
        } else if(direction == 'up'){
            document.querySelector('.pacman').style.transform = 'rotate(270deg)';
        } else if(direction == 'down'){
            document.querySelector('.pacman').style.transform = 'rotate(90deg)';
        }
    }

    getNewPostion(direction){
        const position = new Point(this.#position.getX(), this.#position.getY())
        if (this.getCurrentField() == 5 && ((this.#position.getX() == 0 && direction == 'left')||(this.#position.getX() > 0 && direction == 'right'))) {
                position.move(field.teleport(position))
        } else {
            position.moveDir(direction);
        }
        return position;
    }
}
