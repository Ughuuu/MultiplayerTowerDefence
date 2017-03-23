import { Unit, WalkType } from '../model/unit';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { Player } from '../model/player';
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
    private collisionBits: number[] = [];
    units = {};

    constructor(public physicsHandler: PhysicsHandler) {
        super('UnitBuilder');
        for(let i=0;i<16;i++){
            this.collisionBits[i] = Math.pow(2, i);
        }
    }

    create(type: number, player: Player, position: Point): number {
        let unit_type = UnitBuilder.types[type];
        let circleShape = this.physicsHandler.createCircle(unit_type.radius);
        circleShape.collisionGroup = this.collisionBits[player.location];
        circleShape.collisionMask = this.collisionBits[player.location];
        position.x-=unit_type.radius;
        position.y-=unit_type.radius;
        let body_id = this.physicsHandler.createBody(circleShape, unit_type.mass, position);
        let unit = new Unit(body_id, player.id);
        unit.body = this.physicsHandler.world.bodies[this.physicsHandler.world.bodies.length - 1];
        unit.health = unit_type.health;
        unit.damage = unit_type.damage;
        unit.elementType = unit_type.elementType;
        unit.type = type;
        unit.speed = unit_type.speed;
        unit.armor = unit_type.armor;
        unit.walkType = unit_type.walkType;
        this.units[unit.id] = unit;
        player.unit_ids.push(unit.id);
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