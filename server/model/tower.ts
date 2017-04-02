import { Point } from './point';
import { ElementType } from './element.type';

export class Tower {
    health: number;
    damage: number;
    elementType: ElementType;
    speed: number;
    type: number;
    body: any;
    lastTimeShot: number = 0;
    range: number;
    explosionRadius: number;
    projectileSpeed: number;
    projectile_ids: number[] = [];

    constructor(public id: number, public owner_id: number) { }
}