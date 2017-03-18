import { Point } from './point';
import { WalkType } from './walk.type';
import { ElementType } from './element.type';

export class Unit {
    position: Point;
    speed: Point;
    health: number;
    walkType: WalkType;
    elementType: ElementType;
    owner: number;

    constructor(position: Point, speed: Point, health: number, walkType: WalkType, elementType: ElementType, owner: number) {
        this.position = position;
        this.speed = speed;
        this.health = health;
        this.walkType = walkType;
        this.elementType = elementType;
        this.owner = owner;
    }

    update(): void{
        this.position.x+=this.speed.x;
        this.position.y+=this.speed.y;
    }
}