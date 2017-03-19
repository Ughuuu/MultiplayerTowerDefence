import { Tower } from '../model/tower';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';

export class TowerType {
    constructor(public name: string,
        public texture: string,
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
            'light_tower.png',
            0.1,
            10,
            15,
            ElementType.Normal,
            1)
    ];
    towers = {};

    constructor(public physicsHandler: PhysicsHandler) {
        super('TowerBuilder');
    }

    create(type: number, owner_id: number, position: Point): number {
        let tower_type = TowerBuilder.types[type];
        let boxShape = this.physicsHandler.createBox(tower_type.radius, tower_type.radius);
        let body_id = this.physicsHandler.createBody(boxShape, position);
        let tower = new Tower(body_id, owner_id);
        tower.health = tower_type.health;
        tower.damage = tower_type.damage;
        tower.elementType = tower_type.elementType;
        tower.speed = tower_type.speed;
        tower.type = type;
        this.towers[tower.id] = tower;
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