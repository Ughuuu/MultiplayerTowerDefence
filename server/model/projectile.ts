import { Point } from './point';

export class Projectile {
    damage: number;
    elementType: ElementType;
    speed: number;
    type: number;
    body: any;
    startPoint: Point;
    explosionRadius: number;
    sqRange: number;
    unitId: number;
    oldSpeed: number[];

    constructor(public id: number, public tower_id: number) { }

    public isDead(): boolean{
        let x: number = this.startPoint.x - this.body.position[0];
        let y: number = this.startPoint.y - this.body.position[1];
        return x*x + y*y > this.sqRange;
    }
}