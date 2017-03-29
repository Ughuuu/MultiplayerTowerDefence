import { Projectile } from '../model/projectile';
import { ElementType } from '../model/element.type';
import { Point } from '../model/point';
import { Tower } from '../model/tower';
import { Player } from '../model/player';
import { Unit } from '../model/unit';
import { PhysicsHandler } from '../controller/physics.handler';
import { Builder } from './builder';
import { UnitBuilder } from './unit.builder';
import { TowerBuilder } from './tower.builder';

export class ProjectileType {
    constructor(public name: string,
        public model: string) { }
}

export class ProjectileBuilder extends Builder {
    public static types: ProjectileType[] = [
        new ProjectileType('arrow',
            '/assets/fat_peasant_noTEXTURE_SK.json')
    ];
    public static collisionBit: number = Math.pow(2, 4);
    projectiles = {};

    constructor(public physicsHandler: PhysicsHandler, public towerBuilder: TowerBuilder, public players) {
        super('ProjectileBuilder');
    }

    create(tower: Tower, position: Point, unitId: number): number {
        let projectile_type = ProjectileBuilder.types[tower.projectileType];
        let particleShape = this.physicsHandler.createParticle();
        particleShape.collisionGroup = ProjectileBuilder.collisionBit;
        particleShape.collisionMask = UnitBuilder.collisionBit;
        let body = this.physicsHandler.createBody(this.players[tower.owner_id], particleShape, 1, position, 0);
        let projectile = new Projectile(body.id, tower.id);
        tower.projectile_ids.push(projectile.id);
        this.projectiles[projectile.id] = projectile;
        projectile.body = body;
        projectile.damage = tower.damage;
        projectile.elementType = tower.elementType;
        projectile.speed = tower.projectileSpeed;
        projectile.type = tower.type;
        projectile.startPoint = position;
        projectile.explosionRadius = tower.explosionRadius;
        projectile.sqRange = tower.range * tower.range;
        projectile.unitId = unitId;

        return projectile.id;
    }

    get(id): Projectile {
        return this.projectiles[id];
    }

    remove(id): void {
        let projectile: Projectile = this.projectiles[id];
        let tower: Tower = this.towerBuilder.towers[projectile.tower_id];
        tower.projectile_ids.splice(tower.projectile_ids.indexOf(projectile.id), 1);
        this.physicsHandler.destroyBody(this.players[tower.owner_id], id);
        delete this.projectiles[id];
    }
}