import { createPlayground } from "./methods.js";
import { Point } from "./point.js";

export const fieldSize = 1;
export const unit = 'rem';

export class Field{
    #FIELD_MAPS = [
        'pink',
        'square',
        'google',
        'google_colored',
    ]

    #pg = [];
    #dots;
    #intervals = [];
    #fieldMap = 0;
    #exitX = []
    #exitY = [];

    get exitX(){ return this.#exitX}
    get exitY(){ return this.#exitY}

    get fieldMaps() {
        return this.#FIELD_MAPS;
    }

    setFieldMap = (index) => {
        if (index>=0 && index<this.#FIELD_MAPS.length) {
            this.#fieldMap = index;
        }
    }

    #ghostDoorInit(x,y){
        if(!this.#exitX.includes(x)) this.#exitX.push(x);
        if(!this.#exitY.includes(y)) this.#exitY.push(y);
        console.log(this.#exitX)
        console.log(this.#exitY)
    }

    get fieldMap(){
        return this.#FIELD_MAPS[this.#fieldMap];
    }

    get intervals(){
        return this.#intervals;
    }
    
    get bottom(){
        return this.#pg.length - 1;
    } 

    teleport(position){
        return new Point(position.x>0?0:this.#pg[0].length-1,position.y);   
    }

    getTagField(position){
        return document.querySelector(`[data-x='${position.x}'][data-y='${position.y}']`);
    }
    
    getField(position){
        return this.#pg[position.y][position.x];
    }

    init(pg){
        this.#pg = pg;
        this.#dots = 0;
        this.#exitX=[];
        this.#exitY=[];
        pg.forEach((row,y) => row.forEach((field,x) => {
            if(field == 1 || field == 2) this.#dots++;
            if(field==-3){this.#ghostDoorInit(x,y)}
        }));
    }

    clearIntervals(){
        let interval = this.#intervals.pop();
        while (interval){
            clearInterval(interval);
            interval = this.#intervals.pop();
        }
    }

    eatDot(position){
        if (this.#pg[position.y][position.x] == 1){
            const eatenDot = this.getTagField(position);
            eatenDot.classList.remove('dot');
            this.#pg[position.y][position.x] = 0;
            this.#dots--;
        }
    }

    eatGreatDot(position){
        if (this.#pg[position.y][position.x]==2){
            const eatenDot = this.getTagField(position);
            eatenDot.classList.remove('dot');
            clearInterval(eatenDot.dataset.interval);
            eatenDot.dataset.interval = '';
            eatenDot.classList.remove('great-dot');
            this.#pg[position.y][position.x] = 0;
            this.#dots--;
        }
    }

    isFinish(){
        return this.#dots == 0;
    }
}
