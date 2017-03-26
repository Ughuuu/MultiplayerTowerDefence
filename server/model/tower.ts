import { Point } from './point';
import { ElementType } from './element.type';

export enum ProjectileType{
    Arrow = 0
}

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
    projectileType: ProjectileType;
    projectileSpeed: number;
    projectile_ids: number[] = [];

    constructor(public id: number, public owner_id: number) { }
}