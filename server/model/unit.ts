import { Point } from './point';
import { ElementType } from './element.type';

export enum WalkType {
    Ground = 0,
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

    constructor(public id: number, public owner_id: number) { }
}