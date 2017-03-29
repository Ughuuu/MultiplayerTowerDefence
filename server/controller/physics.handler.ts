import { Handler } from './handler';
import { MapHandler } from './map.handler';
import { GameRoom } from '../rooms/game.room';
import { Player } from '../model/player';
import { Point } from '../model/point';
import { Unit } from '../model/unit';
import { Tower } from '../model/tower';
import { Projectile } from '../model/projectile';
import { UnitBuilder, UnitType } from '../builders/unit.builder';
import { ProjectileBuilder, ProjectileType } from '../builders/projectile.builder';
import { TowerBuilder, TowerType } from '../builders/tower.builder';
import { MoneyHandler } from '../controller/money.handler';
var p2 = require('p2');

export class PhysicsHandler extends Handler {
    private static gravity = [0, 0];
    public worlds = {};
    private body_index: number = 1;
    private old_state = {};
    private time: boolean[] = [];
    private iteration: number = 0;
    private decimals: number = Math.pow(10, 3);
    private precision1: number = Math.pow(10, 6);
    private precision2: number = Math.pow(10, 12);
    public static collisionBits: number[] = [];
    private events = {};
    private unitFollower = {};
    private killPlayer = [];

    constructor() {
        super('PhysicsHandler');
        for (let i = 0; i < 16; i++) {
            PhysicsHandler.collisionBits[i] = Math.pow(2, i);
        }
        this.old_state['tower_types'] = TowerBuilder.types;
        this.old_state['unit_types'] = UnitBuilder.types;
        this.old_state['bodies'] = {};
        for (let i = 0; i < 5; i++) {
            this.time.push(false);
        }
    }

    onBeginContact(evt, id: number) {
        if (this.events[id][evt.bodyA.id + ',' + evt.bodyB.id] == null && this.events[id][evt.bodyB.id + ',' + evt.bodyA.id] == null) {
            this.events[id][evt.bodyA.id + ',' + evt.bodyB.id] = { bodyA: evt.bodyA, bodyB: evt.bodyB };
        }
    }

    onEndContact(evt, id: number) {
        if (this.events[id][evt.bodyA.id + ',' + evt.bodyB.id] != null) {
            delete this.events[id][evt.bodyA.id + ',' + evt.bodyB.id];
        }
        if (this.events[id][evt.bodyB.id + ',' + evt.bodyA.id] != null) {
            delete this.events[id][evt.bodyB.id + ',' + evt.bodyA.id];
        }
    }

    onJoin(player: Player, handlers) {
        this.events[player.id] = {};
        this.worlds[player.id] = new p2.World({ gravity: PhysicsHandler.gravity, solver: new p2.GSSolver({ iterations: 5, tolerance: 1e-3 }) });
        let id = player.id;
        this.worlds[player.id].on("beginContact", function (evt) { this.onBeginContact(evt, id) }.bind(this));
        this.worlds[player.id].on("endContact", function (evt) { this.onEndContact(evt, id) }.bind(this));
        let mapHandler: MapHandler = handlers['MapHandler'];
        player.walls.push(this.createBody(player, this.createPlane(player), 0, new Point(0, 0), -Math.PI / 2).id);
        player.walls.push(this.createBody(player, this.createPlane(player), 0, new Point(mapHandler.size.x, 0), Math.PI / 2).id);
        player.walls.push(this.createBody(player, this.createPlane(player), 0, new Point(0, 0), 0).id);
        player.walls.push(this.createBody(player, this.createPlane(player), 0, new Point(0, mapHandler.size.y), 3 * Math.PI / 2).id);
    }

    onLeave(player, handlers, builders) {
        this.killPlayer.push(player);
    }

    createUnit(type: number, player: Player, unitBuilder: UnitBuilder, width: number) {
        unitBuilder.create(type, player, new Point(width + 0.5, 0.5));
    }

    createTower(type: number, position: Point, player: Player, towerBuilder: TowerBuilder) {
        return towerBuilder.create(type, player, position);
    }

    createTowerCall(player: Player, data: any, handlers, builders, gameRoom: GameRoom) {
        if (data['createTower'] != null) {
            let moneyHandler: MoneyHandler = handlers['MoneyHandler'];
            let mapHandler: MapHandler = handlers['MapHandler'];
            let towerBuilder: TowerBuilder = builders['TowerBuilder'];
            let type: number = data['createTower']['type'];
            let position: Point = data['createTower']['position'];
            if (type == null || position == null)
                return;
            let tower_type = TowerBuilder.types[type];
            let beforeTowerId = mapHandler.checkTower(player, position, tower_type.radius);
            if (!moneyHandler.hasGold(player, tower_type.price)) {
                return;
            }
            if (!(beforeTowerId == 0 && tower_type.upgradeFrom == 'null')) {
                return;
            } else if (tower_type.upgradeFrom != 'null') {
                let beforeTower: Tower = towerBuilder.get(beforeTowerId);
                if (beforeTower == null || tower_type.upgradeFrom == null || TowerBuilder.types[beforeTower.type].name != tower_type.upgradeFrom) {
                    return;
                }
                towerBuilder.remove(beforeTower);
            }
            moneyHandler.buy(player, tower_type.price, gameRoom);
            let id = this.createTower(type, position, player, towerBuilder);
            mapHandler.addTower(player, position, tower_type.radius, id);
        }
    }

    destroyTowerCall(player: Player, data: any, handlers, builders, gameRoom: GameRoom) {
        if (data['destroyTower'] != null) {
            let moneyHandler: MoneyHandler = handlers['MoneyHandler'];
            let towerBuilder: TowerBuilder = builders['TowerBuilder'];
            let mapHandler: MapHandler = handlers['MapHandler'];
            let position: Point = data['destroyTower']['position'];
            if (position == null)
                return;
            let id = mapHandler.checkTower(player, position, 1);
            if (id == 0) {
                return;
            }
            let towerType = TowerBuilder.types[towerBuilder.get(id).type];
            mapHandler.clearTower(player, position, towerType.radius);
            moneyHandler.sell(player, towerType.price, gameRoom);
            this.destroyBody(player, id);
        }
    }

    createUnitCall(player: Player, data: any, handlers, builders, gameRoom: GameRoom) {
        if (data['createUnit'] != null && player.lastSend > 200) {
            player.lastSend = 0;
            let moneyHandler: MoneyHandler = handlers['MoneyHandler'];
            let mapHandler: MapHandler = handlers['MapHandler'];
            let unitBuilder: UnitBuilder = builders['UnitBuilder'];
            let type: number = data['createUnit']['type'];
            if (type == null)
                return;
            let unitType = UnitBuilder.types[type];
            if (!moneyHandler.hasGold(player, unitType.price)) {
                return;
            }
            moneyHandler.spawn(player, unitType.price, unitType.income, gameRoom);
            player.creep_location++;
            player.creep_location %= mapHandler.size.x;
            this.createUnit(type,
                gameRoom.state.getPlayerByLocation((player.location + 1) % gameRoom.options.maxPlayers),
                unitBuilder,
                player.creep_location);
        }
    }

    onMessage(player: Player, data: any, handlers, builders, gameRoom: GameRoom) {
        this.createTowerCall(player, data, handlers, builders, gameRoom);
        this.destroyTowerCall(player, data, handlers, builders, gameRoom);
        this.createUnitCall(player, data, handlers, builders, gameRoom);
    }

    towerInRange(player: Player, tower: Tower, other, time: number, projectileBuilder: ProjectileBuilder) {
        if (time - tower.lastTimeShot > tower.speed) {
            tower.lastTimeShot = time;
            projectileBuilder.create(tower, new Point(tower.body.position[0], tower.body.position[1]), other.id);
        }
    }

    projectileHit(player: Player,
        projectile: Projectile,
        other,
        projectileBuilder: ProjectileBuilder,
        unitBuilder: UnitBuilder,
        towerBuilder: TowerBuilder,
        moneyHandler: MoneyHandler,
        players,
        gameRoom: GameRoom) {
        let unit = unitBuilder.get(other.id);
        if (unit == null) {
            return;
        }
        moneyHandler.bounty(players[towerBuilder.get(projectile.tower_id).owner_id], UnitBuilder.types[unit.type].bounty, gameRoom);
        unit.health -= projectile.damage;
        if (unit.health <= 0) {
            unitBuilder.remove(unit.id);
        }
        projectileBuilder.remove(projectile.id);
        delete this.old_state['bodies'][unit.id];
        delete this.old_state['bodies'][projectile.id];
    }

    handleEvents(players, gameRoom: GameRoom, handlers, builders) {
        let unitBuilder: UnitBuilder = builders['UnitBuilder'];
        let towerBuilder: TowerBuilder = builders['TowerBuilder'];
        let projectileBuilder: ProjectileBuilder = builders['ProjectileBuilder'];
        let moneyHandler: MoneyHandler = handlers['MoneyHandler'];
        for (let id in players) {
            for (let event in this.events[id]) {
                let bodyA = this.events[id][event].bodyA;
                let bodyB = this.events[id][event].bodyB;
                let tower = towerBuilder.get(bodyA.id);
                if (tower != null) {
                    this.towerInRange(players[id], tower, bodyB, gameRoom.clock.currentTime, projectileBuilder);
                    continue;
                }
                tower = towerBuilder.get(bodyB.id);
                if (tower != null) {
                    this.towerInRange(players[id], tower, bodyA, gameRoom.clock.currentTime, projectileBuilder);
                    continue;
                }
                let projectile = projectileBuilder.get(bodyA.id);
                if (projectile != null) {
                    this.projectileHit(players[id], projectile, bodyB, projectileBuilder, unitBuilder, towerBuilder, moneyHandler, players, gameRoom);
                    continue;
                }
                projectile = projectileBuilder.get(bodyB.id);
                if (projectile != null) {
                    this.projectileHit(players[id], projectile, bodyA, projectileBuilder, unitBuilder, towerBuilder, moneyHandler, players, gameRoom);
                    continue;
                }
            }
        }
    }

    endPlayers(players, towerBuilder) {
        for (let player of this.killPlayer) {
            let units: number[] = player.unit_ids;
            let towers: number[] = player.tower_ids;
            for (let id of units) {
                delete this.old_state['bodies'][id];
            }
            for (let id of towers) {
                let projectiles = towerBuilder.get(id).projectile_ids;
                for (let id_proj of projectiles) {
                    delete this.old_state['bodies'][id_proj];
                }
                delete this.old_state['bodies'][id];
            }
            delete this.events[player.id];
            delete this.worlds[player.id];
        }
        this.killPlayer = [];
    }

    update(players, gameRoom: GameRoom, handlers, builders) {
        for (let id in players) {
            players[id].lastSend += gameRoom.clock.deltaTime;
            this.worlds[id].step(GameRoom.ms);
        }
        let unitBuilder: UnitBuilder = builders['UnitBuilder'];
        let towerBuilder: TowerBuilder = builders['TowerBuilder'];
        let projectileBuilder: ProjectileBuilder = builders['ProjectileBuilder'];
        let moneyHandler: MoneyHandler = handlers['MoneyHandler'];

        this.handleEvents(players, gameRoom, handlers, builders);

        this.iteration++;
        this.time[0] = true;
        this.time[1] = this.iteration % 3 == 0;
        this.time[2] = this.iteration % 5 == 0;
        this.time[3] = this.iteration % 7 == 0;
        this.time[4] = this.iteration % 13 == 0;
        let mapHandler: MapHandler = handlers['MapHandler'];
        for (let id in players) {
            let player: Player = players[id];
            let units: number[] = player.unit_ids;
            let towers: number[] = player.tower_ids;
            let toRemoveUnit: number[] = [];
            let toRemoveProjectile: number[] = [];
            for (let unit_id of units) {
                let unit = unitBuilder.get(unit_id);
                let body = unit.body;
                let position = new Point(body.position[0], body.position[1]);
                let dir: Point = mapHandler.getNext(player, position, unit.speed, unit, gameRoom.clock.currentTime);
                body.velocity[0] = dir.x;
                body.velocity[1] = dir.y;
                if (mapHandler.isDone(player, position, unit)) {
                    player.life--;
                    toRemoveUnit.push(unit.id);
                }
            }
            for (let tower_id of towers) {
                let tower = towerBuilder.get(tower_id);
                for (let projectile_id of tower.projectile_ids) {
                    let projectile = projectileBuilder.get(projectile_id);
                    if (projectile.isDead()) {
                        toRemoveProjectile.push(projectile_id);
                        continue;
                    }
                    let unit = unitBuilder.get(projectile.unitId);
                    if (unit == null) {
                        if (projectile.oldSpeed != null) {
                            projectile.body.velocity = projectile.oldSpeed;
                        } else {
                            toRemoveProjectile.push(projectile_id);
                        }
                        continue;
                    }
                    let x = unit.body.position[0] - projectile.body.position[0];
                    let y = unit.body.position[1] - projectile.body.position[1];
                    let mod = Math.sqrt(x * x + y * y);
                    let dir = new Point(x / mod, y / mod);
                    projectile.body.velocity = [dir.x * projectile.speed, dir.y * projectile.speed];
                    projectile.oldSpeed = projectile.body.velocity;
                }
            }
            for (let unit_id of toRemoveUnit) {
                unitBuilder.remove(unit_id);
                delete this.old_state['bodies'][unit_id];
            }
            for (let projectile_id of toRemoveProjectile) {
                projectileBuilder.remove(projectile_id);
                delete this.old_state['bodies'][projectile_id];
            }
        }
        this.endPlayers(players, towerBuilder);
    }

    getSpeedLevel(velx: number, vely: number): number {
        let vel = Math.abs(velx) + Math.abs(vely);
        if (vel > 1) {
            return 0;
        }
        if (vel > 0.5) {
            return 1;
        }
        if (vel > 0.05) {
            return 2;
        }
        if (vel > 0.005) {
            return 3;
        }
        return 4;
    }

    static getNumberWithPrecision(x: number, decimals: number, padding: number) {
        return Math.abs(Math.round(x * decimals)) * padding;
    }

    toJSON(players, handlers, builders): any {
        let bodies_data = {};
        let towerBuilder: TowerBuilder = builders['TowerBuilder'];
        let unitBuilder: UnitBuilder = builders['UnitBuilder'];
        let projectileBuilder: ProjectileBuilder = builders['ProjectileBuilder'];
        let mapHandler: MapHandler = handlers['MapHandler'];
        for (let id in players) {
            for (let body of this.worlds[id].bodies) {
                if (this.time[this.getSpeedLevel(body.velocity[0], body.velocity[1])] == false)
                    continue;
                let body_id: number = body.id;
                var serialized_body;
                let tower = towerBuilder.get(body_id);
                let x = body.position[0];
                x += players[id].location * mapHandler.size.x;
                let xya = PhysicsHandler.getNumberWithPrecision(x, this.decimals, 1) +
                    PhysicsHandler.getNumberWithPrecision(body.position[1], this.decimals, this.precision1) +
                    PhysicsHandler.getNumberWithPrecision(body.angle, this.decimals, this.precision2);
                if (tower != null) {
                    serialized_body = {
                        classType: 0,
                        type: tower.type,
                        xya: xya
                    };
                }
                let unit = unitBuilder.get(body_id);
                if (unit != null) {
                    serialized_body = {
                        classType: 1,
                        type: unit.type,
                        xya: xya
                    };
                }
                let projectile = projectileBuilder.get(body_id);
                if (projectile != null) {
                    serialized_body = {
                        classType: 2,
                        type: projectile.type,
                        xya: xya
                    };
                }
                this.old_state['bodies'][body_id] = serialized_body;
            }
        }
        return this.old_state;
    }

    createCircle(radius: number) {
        return new p2.Circle({ radius: radius });
    }

    createParticle() {
        return new p2.Particle();
    }

    createPlane(player: Player) {
        let plane = new p2.Plane();
        plane.collisionGroup = TowerBuilder.collisionBit;
        plane.collisionMask = UnitBuilder.collisionBit;
        return plane;
    }

    createBox(w: number, h: number) {
        return new p2.Box({ width: w, height: h });
    }

    createBody(player: Player, shape: any, mass: number, position: Point, angle: number) {
        let body = new p2.Body({
            mass: mass,
            position: [position.x, position.y],
            angle: angle,
            id: this.body_index
        });
        body.addShape(shape);

        this.worlds[player.id].addBody(body);
        this.body_index++;
        return body;
    }

    createBodyWithSensor(player: Player, shape1: any, shape2: any, mass: number, position: Point, angle: number) {
        // Define body
        let body = new p2.Body({
            mass: mass,
            position: [position.x, position.y],
            angle: angle,
            id: this.body_index
        });
        shape2.sensor = true;
        body.addShape(shape1);
        body.addShape(shape2);

        this.worlds[player.id].addBody(body);
        this.body_index++;
        return body;
    }

    destroyBody(player: Player, body_index) {
        this.worlds[player.id].removeBody(this.worlds[player.id].getBodyById(body_index));
    }
}