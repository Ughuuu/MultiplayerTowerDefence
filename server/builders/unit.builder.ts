import { Unit, WalkType } from '../model/unit';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { Player } from '../model/player';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';
import { TowerBuilder } from './tower.builder';
import { ProjectileBuilder } from './projectile.builder';

export class UnitType {
    public damage: number = 15;
    public mass: number = 1;

    constructor(public name: string,
        public model: string,
        public radius: number,
        public health: number,
        public elementType: ElementType,
        public speed: number,
        public armor: number,
        public walkType: WalkType,
        public price: number,
        public income: number,
        public bounty: number) { }
}

export class UnitBuilder extends Builder {
    public static types: UnitType[] = [
        new UnitType('Peasant',
            '/assets/units/peasant/peasant.json',
            0.2,//size
            6,//hp
            ElementType.Iron,
            0.2,//speed
            0,//armor
            WalkType.Slow,
            5,//price
            1,//income
            1),//bounty
        new UnitType('Fox',
            '/assets/units/fox/fox.json',
            0.2,//size
            10,//hp
            ElementType.Iron,
            1,//speed
            0,//armor
            WalkType.Fast,
            20,//price
            10,//income
            4),//bounty
        new UnitType('Skeleton',
            '/assets/units/skeleton/skeleton.json',
            0.35,//size
            100,//hp
            ElementType.Stone,
            0.2,//speed
            10,//armor
            WalkType.Boss,
            100,//price
            60,//income
            30),//bounty
        new UnitType('Dragon',
            '/assets/units/dragon/dragon.json',
            0.5,//size
            200,//hp
            ElementType.Fire,
            1.5,//speed
            10,//armor
            WalkType.Flying,
            300,//price
            180,//income
            50),//bounty
        new UnitType('Pirate',
            '/assets/units/pirate/pirate.json',
            0.3,//size
            100,//hp
            ElementType.Ice,
            1.5,//speed
            10,//armor
            WalkType.Fast,
            500,//price
            300,//income
            100),//bounty
        new UnitType('Knight',
            '/assets/units/knight/knight.json',
            0.3,//size
            150,//hp
            ElementType.Ice,
            0.7,//speed
            10,//armor
            WalkType.Slow,
            150,//price
            75,//income
            30),//bounty
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
        if (unit_type.walkType != WalkType.Flying) {
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
        let body = this.physicsHandler.createBody(player, circleShape, unit_type.mass * unit_type.radius, position, 0);
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