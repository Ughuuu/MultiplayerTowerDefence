import { Unit, WalkType } from '../model/unit';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { Player } from '../model/player';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';
import { TowerBuilder } from './tower.builder';
import { ProjectileBuilder } from './projectile.builder';

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
        public mass: number,
        public price: number,
        public income: number,
        public bounty: number) { }
}

export class UnitBuilder extends Builder {
    public static types: UnitType[] = [
        new UnitType('dragon',
            '/assets/units/dragon/dragon.json',
            0.2,
            70,
            15,
            ElementType.Normal,
            3,
            0,
            WalkType.Flying,
            1,
            10,
            0.5,
            2),
        new UnitType('peasant',
            '/assets/units/peasant/peasant.json',
            0.2,
            30,
            15,
            ElementType.Normal,
            2,
            0,
            WalkType.Ground,
            1,
            2,
            0.1,
            0.5)
    ];
    public static collisionBitGround: number = Math.pow(2, 1);
    public static collisionBitFlying: number = Math.pow(2, 2);
    units = {};

    constructor(public physicsHandler: PhysicsHandler, public players: {}) {
        super('UnitBuilder');
    }

    create(type: number, player: Player, position: Point): number {
        let unit_type = UnitBuilder.types[type];
        let circleShape = this.physicsHandler.createCircle(unit_type.radius);
        if (unit_type.walkType == WalkType.Ground) {
            circleShape.collisionGroup = UnitBuilder.collisionBitGround;
            circleShape.collisionMask = TowerBuilder.collisionBit
                | UnitBuilder.collisionBitGround
                | ProjectileBuilder.collisionBit;
        } else {
            circleShape.collisionGroup = UnitBuilder.collisionBitFlying;
            circleShape.collisionMask = TowerBuilder.collisionBitSensor
                | UnitBuilder.collisionBitFlying
                | ProjectileBuilder.collisionBit;
        }
        let body = this.physicsHandler.createBody(player, circleShape, unit_type.mass, position, 0);
        let unit = new Unit(body.id, player.id);
        unit.body = body;
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
        let unit: Unit = this.units[id];
        let player: Player = this.players[unit.owner_id];
        player.unit_ids.splice(player.unit_ids.indexOf(unit.id), 1);
        this.physicsHandler.destroyBody(player, id);
        delete this.units[id];
    }
}