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

    constructor() {
        super('PhysicsHandler');
        this.world = new p2.World({ gravity: PhysicsHandler.gravity });
        this.old_state['tower_types'] = TowerBuilder.types;
        this.old_state['unit_types'] = UnitBuilder.types;
        this.old_state['bodies'] = {};
        for (let i = 0; i < 5; i++) {
            this.time.push(false);
        }
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
            for (let unit_id of units) {
                let unit = unitBuilder.get(unit_id);
                let body = unit.body;
                let position = new Point(body.position[0], body.position[1]);
                let dir: Point = mapHandler.getNext(player, position);
                body.velocity[0] = dir.x;
                body.velocity[1] = dir.y;
            }
        }
    }

    getSpeedLevel(velx: number, vely: number): number {
        let vel = Math.abs(velx) + Math.abs(vely);
        if (vel > 4) {
            return 0;
        }
        if (vel > 0.5) {
            return 1;
        }
        if (vel > 0.05) {
            return 2;
        }
        if (vel > 0.001) {
            return 3;
        }
        return 4;
    }

    toJSON(players, handlers, builders): any {
        let bodies_data = {};
        let towerBuilder: TowerBuilder = builders['TowerBuilder'];
        let unitBuilder: UnitBuilder = builders['UnitBuilder'];
        for (let body of this.world.bodies) {
            //if (this.time[this.getSpeedLevel(body.velocity[0], body.velocity[1])] == false)
            //    continue;
            let body_id: number = body.id;
            var serialized_body;
            let tower = towerBuilder.get(body_id);
            if (tower != null) {
                let towerType = TowerBuilder.types[tower.type];
                serialized_body = {
                    isTower: true,
                    type: tower.type,
                    x: body.position[0] * 15,
                    y: body.position[1] * 15,
                    angle: body.angle
                };
            }
            let unit = unitBuilder.get(body_id);
            if (unit != null) {
                let unitType = UnitBuilder.types[unit.type];
                serialized_body = {
                    isTower: false,
                    type: unit.type,
                    x: body.position[0] * 15,
                    y: body.position[1] * 15,
                    angle: body.angle
                };
            }
            this.old_state['bodies'][body_id] = serialized_body;
        }
        return this.old_state;
    }

    createCircle(radius: number) {
        return new p2.Circle({ radius: radius });
    }

    createBox(w: number, h: number) {
        return new p2.Box({ width: w, height: h });
    }

    createBody(shape: any, mass: number, position: Point) {
        // Define body
        let body = new p2.Body({
            mass: mass,
            position: [position.x, position.y],
            angle: 0,
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