import { Point } from "./point.js";

export class Field{
    #pg = [];
    #dots;
    #portals = [];
    
    teleport(position){
        debugger
        return this.#portals.find((point) => point.getX()!=position.getX());
    }

    getTagField(position){
        return document.querySelector(`[data-x='${position.getX()}'][data-y='${position.getY()}']`);
    }
    
    getField(position){
        return this.#pg[position.getY()][position.getX()];
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

    eatDot(position){
        if ((this.#pg[position.getY()][position.getX()] == 1)||this.#pg[position.getY()][position.getX()]==2){
            const eatenDot = this.getTagField(position);
            eatenDot.classList.remove('dot');
            eatenDot.classList.remove('great-dot');
            this.#pg[position.getY()][position.getX()] = 0;
            this.#dots--;
        }
    }

    isFinish(){
        return this.#dots == 0;
    }
}
