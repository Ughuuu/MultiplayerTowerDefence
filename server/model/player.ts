import { Tower } from './tower';
import { Unit } from './unit';

export class Player{
    private id: number;
    towers: Tower[] = [];
    units: Unit[] = [];

    constructor(id: number){
    }

    update(){
        for(let tower of this.towers){
            tower.update();
        }
    }
}