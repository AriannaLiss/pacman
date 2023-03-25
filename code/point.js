export class Point{
    #x; #y;

    getX(){
        return this.#x;
    }

    getY(){
        return this.#y;
    }
    move(point){
        this.#x = point.getX();
        this.#y = point.getY();
    }
    moveDir(direction){
        if (direction === 'right') this.#x++;
        else if (direction === 'left') this.#x--;
        else if (direction === 'up') this.#y--;
        else if (direction === 'down') this.#y++;
    }
    constructor(x,y){
        this.#x = x;
        this.#y = y;
    }
}
