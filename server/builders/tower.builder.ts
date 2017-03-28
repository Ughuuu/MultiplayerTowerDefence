import { Tower, ProjectileType } from '../model/tower';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { Player } from '../model/player';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';
import { UnitBuilder } from './unit.builder';

export class TowerType {
    constructor(public name: string,
        public model: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType,
        public speed: number,
        public range: number,
        public projectileType: ProjectileType,
        public explosionRadius: number,
        public projectileSpeed: number,
        public price: number,
        public upgradeFrom: string
    ) { }
}

export class TowerBuilder extends Builder {

    public static types: TowerType[] = [
        new TowerType(
            'light_tower',
            '/assets/fat_peasant_noTEXTURE_SK.json',
            1,
            10,
            15,
            ElementType.Normal,
            2000,
            6,
            ProjectileType.Arrow,
            0,
            6,
            3,
            "null")
    ];
    private static collisionBitTower: number = Math.pow(2, 2);
    private static collisionBitSensor: number = Math.pow(2, 3);
    public static collisionBit: number = TowerBuilder.collisionBitTower | TowerBuilder.collisionBitSensor;
    towers = {};

    constructor(public physicsHandler: PhysicsHandler, public players) {
        super('TowerBuilder');
    }

    create(type: number, player: Player, position: Point): number {
        let tower_type = TowerBuilder.types[type];
        let boxShape = this.physicsHandler.createBox(tower_type.radius, tower_type.radius);
        boxShape.collisionGroup = TowerBuilder.collisionBitTower;
        boxShape.collisionMask = UnitBuilder.collisionBit;
        let circleShape = this.physicsHandler.createCircle(tower_type.range);
        circleShape.collisionGroup = TowerBuilder.collisionBitSensor;
        circleShape.collisionMask = UnitBuilder.collisionBit;
        position.x += tower_type.radius / 2;
        position.y += tower_type.radius / 2;
        let body = this.physicsHandler.createBodyWithSensor(boxShape, circleShape, 0, position, 0);
        let tower = new Tower(body.id, player.id);
        tower.body = body;
        tower.health = tower_type.health;
        tower.damage = tower_type.damage;
        tower.elementType = tower_type.elementType;
        tower.speed = tower_type.speed;
        tower.type = type;
        tower.range = tower_type.range;
        tower.projectileType = tower_type.projectileType;
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
        this.physicsHandler.destroyBody(id);
        delete this.towers[id];
    }
}