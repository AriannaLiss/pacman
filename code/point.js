export class Point{
    #x; #y;

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }
    isEqual(point){
        return (this.x == point.x && this.y == point.y)
    }

    constructor(x,y){
        this.#x = x;
        this.#y = y;
    }

    move(point){
        this.#x = point.x;
        this.#y = point.y;
    }
    moveDir(direction){
        if (direction === 'right') this.#x++;
        else if (direction === 'left') this.#x--;
        else if (direction === 'up') this.#y--;
        else if (direction === 'down') this.#y++;
    }
}
