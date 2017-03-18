import { Tower } from './tower';
import { Unit } from './unit';

export class Player{
    id: number;
    name: string;
    towers: Tower[] = [];
    units: Unit[] = [];

    constructor(id: number, name: string){
        this.id = id;
        this.name = name;
    }

    update(){
        for(let tower of this.towers){
            tower.update();
        }
    }
}