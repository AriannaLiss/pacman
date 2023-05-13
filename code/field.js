import { Point } from "./point.js";

export const fieldSize = 1;
export const unit = 'rem';

export class Field{
    #pg = [];
    #dots;
    #portals = [];
    #intervals = [];

    get intervals(){
        return this.#intervals;
    }
    
    get bottom(){
        return this.#pg.length - 1;
    } 

    teleport(position){
        return this.#portals.find((point) => point.x!=position.x);
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
        pg.forEach((row,y) => row.forEach((field,x) => {
            if(field == 1 || field == 2) this.#dots++;
            else if (field == 5) {
                this.#portals.push(new Point(x,y));
            }
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
