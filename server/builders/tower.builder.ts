import { Tower } from '../model/tower';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { Player } from '../model/player';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';
import { UnitBuilder } from './unit.builder';

export class TowerType {
    public radius = 1;
    public health = 10;
    constructor(public name: string,
        public model: string,
        public icon: string,
        public damage: number,
        public elementType: ElementType,
        public speed: number,
        public range: number,
        public explosionRadius: number,
        public projectileSpeed: number,
        public price: number,
        public upgradeFrom: string
    ) { }
}

export class TowerBuilder extends Builder {

    public static types: TowerType[] = [
        new TowerType(
            'Stone Tower',
            '/assets/towers/stone/stone.json',
            '/assets/towers/stone/icon.png',
            20,//damage
            ElementType.Stone,
            2000,//speed
            4,//range
            0,//explosionRadius
            5,//speed
            30,//gold
            'null'),
        new TowerType(
            'Ballista Tower',
            '/assets/towers/ballista/ballista.json',
            '/assets/towers/ballista/icon.png',
            4,//damage
            ElementType.Iron,
            500,//speed
            4,//range
            0,//explosionRadius
            10,//speed
            15,//gold
            'null')
    ];
    public static collisionBitTower: number = Math.pow(2, 4);
    public static collisionBitSensor: number = Math.pow(2, 3);
    public static collisionBit: number = TowerBuilder.collisionBitTower | TowerBuilder.collisionBitSensor;
    towers = {};

    constructor(public physicsHandler: PhysicsHandler, public players) {
        super('TowerBuilder');
    }

    create(type: number, player: Player, position: Point): number {
        let tower_type = TowerBuilder.types[type];
        let boxShape = this.physicsHandler.createCircle(tower_type.radius / 2);
        boxShape.collisionGroup = TowerBuilder.collisionBitTower;
        boxShape.collisionMask = UnitBuilder.collisionBitGround;
        let circleShape = this.physicsHandler.createCircle(tower_type.range);
        circleShape.collisionGroup = TowerBuilder.collisionBitSensor;
        circleShape.collisionMask = UnitBuilder.collisionBitGround | UnitBuilder.collisionBitFlying;
        position.x += tower_type.radius / 2;
        position.y += tower_type.radius / 2;
        let body = this.physicsHandler.createBodyWithSensor(player, boxShape, circleShape, 0, position, 0);
        let tower = new Tower(body.id, player.id);
        tower.body = body;
        tower.health = tower_type.health;
        tower.damage = tower_type.damage;
        tower.elementType = tower_type.elementType;
        tower.speed = tower_type.speed;
        tower.type = type;
        tower.range = tower_type.range;
        tower.explosionRadius = tower_type.explosionRadius;
        tower.projectileSpeed = tower_type.projectileSpeed;
        this.towers[tower.id] = tower;
        player.tower_ids.push(tower.id);
        return tower.id;
    }

    get(id): Tower {
        return this.towers[id];
    }

    remove(id): void {
        let tower: Tower = this.towers[id];
        let player: Player = this.players[tower.owner_id];
        player.tower_ids.splice(player.tower_ids.indexOf(tower.id), 1);
        this.physicsHandler.destroyBody(player, id);
        delete this.towers[id];
    }
}