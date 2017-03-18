import { Point } from './point';
import { WalkType } from './walk.type';
import { ElementType } from './element.type';

export class Tower{
    position: Point;
    health: number;
    elementType: ElementType;
    owner: number;

    constructor(position: Point, health: number, elementType: ElementType, owner: number){
        this.position = position;
        this.health = health;
        this.elementType = elementType;
        this.owner = owner;
    }

    update(){

    }
}