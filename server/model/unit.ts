import { Point } from './point';
import { ElementType } from './element.type';

export enum WalkType {
    Slow = 0,
    Fast,
    Boss,
    Flying
}

export class Unit {
    health: number;
    damage: number;
    elementType: ElementType;
    type: number;
    speed: number;
    armor: number;
    walkType: WalkType;
    body: any;
    lastCell: Point = new Point(0, 0);
    stuck: number;

    constructor(public id: number, public owner_id: number) { }
}