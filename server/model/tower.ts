import { Point } from './point';
import { ElementType } from './element.type';

export class Tower {
    health: number;
    damage: number;
    elementType: ElementType;
    speed: number;
    type: number;

    constructor(public id: number, public owner_id: number) { }
}