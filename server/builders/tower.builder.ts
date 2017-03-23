import { Tower } from '../model/tower';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { Player } from '../model/player';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';

export class TowerType {
    constructor(public name: string,
        public model: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType.Normal,
        public speed: number) { }
}

export class TowerBuilder extends Builder {

    public static types: TowerType[] = [
        new TowerType(
            'light_tower',
            'img/monster.json',
            10,
            10,
            15,
            ElementType.Normal,
            1)
    ];
    private collisionBits: number[] = [];
    towers = {};

    constructor(public physicsHandler: PhysicsHandler) {
        super('TowerBuilder');
        for (let i = 0; i < 16; i++) {
            this.collisionBits[i] = Math.pow(2, i);
        }
    }

    create(type: number, player: Player, position: Point): number {
        let tower_type = TowerBuilder.types[type];
        let boxShape = this.physicsHandler.createBox(tower_type.radius * 2, tower_type.radius * 2);
        boxShape.collisionGroup = this.collisionBits[player.location];
        boxShape.collisionMask = this.collisionBits[player.location];
        position.x-=tower_type.radius;
        position.y-=tower_type.radius;
        let body_id = this.physicsHandler.createBody(boxShape, 0, position);
        let tower = new Tower(body_id, player.id);
        tower.body = this.physicsHandler.world.bodies[this.physicsHandler.world.bodies - 1];
        tower.health = tower_type.health;
        tower.damage = tower_type.damage;
        tower.elementType = tower_type.elementType;
        tower.speed = tower_type.speed;
        tower.type = type;
        this.towers[tower.id] = tower;
        player.tower_ids.push(tower.id);
        return tower.id;
    }

    get(id): Tower {
        return this.towers[id];
    }

    remove(id): void {
        this.physicsHandler.destroyBody(id);
        delete this.towers[id];
    }
}