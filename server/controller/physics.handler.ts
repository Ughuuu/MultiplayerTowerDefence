import { Handler } from './handler';
import { GameRoom } from '../rooms/game.room';
import { Player } from '../model/player';
import { Point } from '../model/point';
import { UnitBuilder, UnitType } from '../builders/unit.builder';
import { TowerBuilder, TowerType } from '../builders/tower.builder';
const b2 = require('lucy-b2');

export class PhysicsHandler extends Handler {
    private static gravity = new b2.Vec2(0, -9.8);
    world;
    private body_index: number = 0;
    private bodies = {};

    constructor() {
        super('PhysicsHandler');
        this.world = new b2.World(PhysicsHandler.gravity);
    }

    createUnit(type: number, player: Player, unitBuilder: UnitBuilder){
        unitBuilder.create(type, player.id, new Point(0, 0));
    }

    createTower(type: number, player: Player, towerBuilder: TowerBuilder){
        towerBuilder.create(type, player.id, new Point(0, 0));
    }

    onMessage(player: Player, data: any, handlers, builders) {
        if(data['createTower'] != null){
            this.createTower(data['createTower'], player, builders['TowerBuilder']);
        }
        if(data['createUnit'] != null){
            this.createUnit(data['createUnit'], player, builders['UnitBuilder']);
        }
    }

    update(players, gameRoom: GameRoom, handlers, builders) {
        this.world.Step(GameRoom.ms, 10, 10);
        //gameRoom.broadcast(this.toJSON(players, handlers, builders));
    }

    toJSON(players, handlers, builders): any {
        let bodies_data = {};
        let towerBuilder: TowerBuilder = builders['TowerBuilder'];
        let unitBuilder: UnitBuilder = builders['UnitBuilder'];
        for(let key in this.bodies){
            let body = this.bodies[key];
            let body_id: number = body.userData;
            let tower = towerBuilder.get(body_id);
            if(tower != null){
                let towerType = TowerBuilder.types[tower.type];
                bodies_data[key] = {
                    type: tower.type,
                    position: body.GetPosition(),
                    angle: body.GetAngle()
                };
                continue;
            }
            let unit = unitBuilder.get(body_id);
            if(unit != null){
                let unitType = UnitBuilder.types[unit.type];
                bodies_data[key] = {
                    type: unit.type,
                    position: body.GetPosition(),
                    angle: body.GetAngle()
                };
                continue;
            }
        }
        return {
            bodies: bodies_data,
            tower_types: TowerBuilder.types,
            unit_types: UnitBuilder.types
        };
    }

    createCircle(radius: number){
        let shape = new b2.CircleShape;
        shape.m_radius = radius;
        return shape;
    }

    createBox(w: number, h: number){
        let shape = new b2.PolygonShape;
        shape.SetAsBox(w, h);
        return shape;
    }

    createBody(shape: any, position : Point) {
        // Define body
        let bodyDef = new b2.BodyDef;
        bodyDef.type = b2.BodyType.dynamicBody;
        bodyDef.userData = this.body_index;
        let body = this.world.CreateBody(bodyDef);
        // Define fixture
        let fixDef = new b2.FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.2;
        fixDef.restitution = 0.8;

        fixDef.shape = shape;

        // Create fixture
        body.CreateFixture(fixDef);

        // Move body into initial position ( and rotation )
        body.SetTransform(position.x, position.y, 0);

        this.bodies[this.body_index] = body;
        this.body_index++;
        return this.body_index-1;
    }

    destroyBody(body_index) {
        let body = this.bodies[body_index];
        this.world.DestroyBody(body);
        delete this.bodies[body_index];
    }
}