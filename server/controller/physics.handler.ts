import { Handler } from './handler';
import { MapHandler } from './map.handler';
import { GameRoom } from '../rooms/game.room';
import { Player } from '../model/player';
import { Point } from '../model/point';
import { Unit } from '../model/unit';
import { UnitBuilder, UnitType } from '../builders/unit.builder';
import { TowerBuilder, TowerType } from '../builders/tower.builder';
var p2 = require('p2');

export class PhysicsHandler extends Handler {
    private static gravity = [0, 0];
    public world;
    private body_index: number = 0;
    private old_state = {};
    private time: boolean[] = [];
    private iteration: number = 0;
    private decimals: number = Math.pow(10, 3);
    private precision1: number = Math.pow(10, 6);
    private precision2: number = Math.pow(10, 12);

    constructor() {
        super('PhysicsHandler');
        this.world = new p2.World({ gravity: PhysicsHandler.gravity, solver: new p2.GSSolver({ iterations: 6, tolerance: 1e-6 }) });
        this.world.on("beginContact", this.onBeginContact);
        this.old_state['tower_types'] = TowerBuilder.types;
        this.old_state['unit_types'] = UnitBuilder.types;
        this.old_state['bodies'] = {};
        for (let i = 0; i < 5; i++) {
            this.time.push(false);
        }
    }

    onBeginContact(evt){
        console.log(evt);
    }

    onJoin(player: Player, handlers, builders) {
        let mapHandler: MapHandler = handlers['MapHandler'];
        player.walls.push(this.createBody(this.createPlane(player.location), 0, new Point(0, 0), -Math.PI/2));
        player.walls.push(this.createBody(this.createPlane(player.location), 0, new Point(mapHandler.size.x, 0), Math.PI/2));
        player.walls.push(this.createBody(this.createPlane(player.location), 0, new Point(0, 0), 0));
        player.walls.push(this.createBody(this.createPlane(player.location), 0, new Point(0, mapHandler.size.y), 3*Math.PI/2));
    }

    createUnit(type: number, player: Player, unitBuilder: UnitBuilder, width: number) {
        unitBuilder.create(type, player, new Point(width, 0));
    }

    createTower(type: number, position: Point, player: Player, towerBuilder: TowerBuilder) {
        towerBuilder.create(type, player, position);
    }

    destroyTower(player: Player, tower_id: number) {
    }

    onMessage(player: Player, data: any, handlers, builders) {
        if (data['createTower'] != null) {
            let type: number = data['createTower']['type'];
            let position: Point = data['createTower']['position'];
            if (type == null || position == null)
                return;
            let mapHandler: MapHandler = handlers['MapHandler'];
            let tower_type = TowerBuilder.types[type];
            mapHandler.addTower(player, position, tower_type.radius);
            this.createTower(type, position, player, builders['TowerBuilder']);
        }
        if (data['createUnit'] != null) {
            let type: number = data['createUnit']['type'];
            if (type == null)
                return;
            player.creep_location++;
            player.creep_location %= handlers['MapHandler'].size.x;
            this.createUnit(type, player, builders['UnitBuilder'], player.creep_location);
        }
    }

    update(players, gameRoom: GameRoom, handlers, builders) {
        this.world.step(GameRoom.ms);
        this.iteration++;
        this.time[0] = true;
        this.time[1] = this.iteration % 3 == 0;
        this.time[2] = this.iteration % 5 == 0;
        this.time[3] = this.iteration % 7 == 0;
        this.time[4] = this.iteration % 13 == 0;
        let mapHandler: MapHandler = handlers['MapHandler'];
        let unitBuilder: UnitBuilder = builders['UnitBuilder'];
        for (let id in players) {
            let player = players[id];
            let units: number[] = player.unit_ids;
            let toRemove: number[] = [];
            for (let unit_id of units) {
                let unit = unitBuilder.get(unit_id);
                let body = unit.body;
                let position = new Point(body.position[0], body.position[1]);
                let dir: Point = mapHandler.getNext(player, position, unit.speed);
                body.velocity[0] = dir.x;
                body.velocity[1] = dir.y;
                if (mapHandler.isDone(player, position)) {
                    toRemove.push(unit.id);
                }
            }
            for (let unit_id of toRemove) {
                unitBuilder.remove(unit_id);
            }
        }
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
        for (let body of this.world.bodies) {
            if (this.time[this.getSpeedLevel(body.velocity[0], body.velocity[1])] == false)
                continue;
            let body_id: number = body.id;
            var serialized_body;
            let tower = towerBuilder.get(body_id);
            let xya = PhysicsHandler.getNumberWithPrecision(body.position[0], this.decimals, 1) +
                PhysicsHandler.getNumberWithPrecision(body.position[1], this.decimals, this.precision1) +
                PhysicsHandler.getNumberWithPrecision(body.angle, this.decimals, this.precision2);
            if (tower != null) {
                let towerType = TowerBuilder.types[tower.type];
                serialized_body = {
                    isTower: true,
                    type: tower.type,
                    xya: xya
                };
            }
            let unit = unitBuilder.get(body_id);
            if (unit != null) {
                let unitType = UnitBuilder.types[unit.type];
                serialized_body = {
                    isTower: false,
                    type: unit.type,
                    xya: xya
                };
            }
            this.old_state['bodies'][body_id] = serialized_body;
        }
        return this.old_state;
    }

    createCircle(radius: number) {
        return new p2.Circle({ radius: radius });
    }

    createParticle(radius: number) {
        return new p2.Particle();
    }

    createPlane(collisionBit: number) {
        let plane = new p2.Plane();
        plane.collisionGroup = TowerBuilder.collisionBits[collisionBit];
        plane.collisionMask = TowerBuilder.collisionBits[collisionBit];
        return plane;
    }

    createBox(w: number, h: number) {
        return new p2.Box({ width: w, height: h });
    }

    createBody(shape: any, mass: number, position: Point, angle: number) {
        // Define body
        let body = new p2.Body({
            mass: mass,
            position: [position.x, position.y],
            angle: angle,
            id: this.body_index
        });
        body.addShape(shape);

        this.world.addBody(body);
        this.body_index++;
        return this.body_index - 1;
    }

    destroyBody(body_index) {
        this.world.removeBody(this.world.getBodyById(body_index));
    }
}