import { Unit, WalkType } from '../model/unit';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';

export class UnitType {
    constructor(public name: string,
        public model: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType,
        public speed: number,
        public armor: number,
        public walkType: WalkType,
        public mass: number) { }
}

export class UnitBuilder extends Builder {
    public static types: UnitType[] = [
        new UnitType('light_creep',
            'img/fat_peasant_noTEXTURE_SK.json',
            1,
            10,
            15,
            ElementType.Normal,
            1,
            0,
            WalkType.Ground,
            1)
    ];
    units = {};

    constructor(public physicsHandler: PhysicsHandler) {
        super('UnitBuilder');
    }

    create(type: number, owner_id: number, position: Point): number {
        let unit_type = UnitBuilder.types[type];
        let circleShape = this.physicsHandler.createCircle(unit_type.radius);
        let body_id = this.physicsHandler.createBody(circleShape, unit_type.mass, position);
        let unit = new Unit(body_id, owner_id);
        unit.health = unit_type.health;
        unit.damage = unit_type.damage;
        unit.elementType = unit_type.elementType;
        unit.type = type;
        unit.speed = unit_type.speed;
        unit.armor = unit_type.armor;
        unit.walkType = unit_type.walkType;
        this.units[unit.id] = unit;
        return unit.id;
    }

    get(id): Unit {
        return this.units[id];
    }

    remove(id): void {
        this.physicsHandler.destroyBody(id);
        delete this.units[id];
    }
}