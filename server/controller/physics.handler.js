"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var handler_1 = require("./handler");
var game_room_1 = require("../rooms/game.room");
var point_1 = require("../model/point");
var unit_builder_1 = require("../builders/unit.builder");
var tower_builder_1 = require("../builders/tower.builder");
var b2 = require('lucy-b2');
var PhysicsHandler = (function (_super) {
    __extends(PhysicsHandler, _super);
    function PhysicsHandler() {
        var _this = _super.call(this, 'PhysicsHandler') || this;
        _this.body_index = 0;
        _this.bodies = {};
        _this.world = new b2.World(PhysicsHandler.gravity);
        return _this;
    }
    PhysicsHandler.prototype.createUnit = function (type, player, unitBuilder) {
        unitBuilder.create(type, player.id, new point_1.Point(0, 0));
    };
    PhysicsHandler.prototype.createTower = function (type, player, towerBuilder) {
        towerBuilder.create(type, player.id, new point_1.Point(0, 0));
    };
    PhysicsHandler.prototype.onMessage = function (player, data, handlers, builders) {
        if (data['createTower'] != null) {
            this.createTower(data['createTower'], player, builders['TowerBuilder']);
        }
        if (data['createUnit'] != null) {
            this.createUnit(data['createUnit'], player, builders['UnitBuilder']);
        }
    };
    PhysicsHandler.prototype.update = function (players, gameRoom, handlers, builders) {
        this.world.Step(game_room_1.GameRoom.ms, 10, 10);
        //gameRoom.broadcast(this.toJSON(players, handlers, builders));
    };
    PhysicsHandler.prototype.toJSON = function (players, handlers, builders) {
        var bodies_data = {};
        var towerBuilder = builders['TowerBuilder'];
        var unitBuilder = builders['UnitBuilder'];
        for (var key in this.bodies) {
            var body = this.bodies[key];
            var body_id = body.userData;
            var tower = towerBuilder.get(body_id);
            if (tower != null) {
                var towerType = tower_builder_1.TowerBuilder.types[tower.type];
                bodies_data[key] = {
                    type: tower.type,
                    position: body.GetPosition(),
                    angle: body.GetAngle()
                };
                continue;
            }
            var unit = unitBuilder.get(body_id);
            if (unit != null) {
                var unitType = unit_builder_1.UnitBuilder.types[unit.type];
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
            tower_types: tower_builder_1.TowerBuilder.types,
            unit_types: unit_builder_1.UnitBuilder.types
        };
    };
    PhysicsHandler.prototype.createCircle = function (radius) {
        var shape = new b2.CircleShape;
        shape.m_radius = radius;
        return shape;
    };
    PhysicsHandler.prototype.createBox = function (w, h) {
        var shape = new b2.PolygonShape;
        shape.SetAsBox(w, h);
        return shape;
    };
    PhysicsHandler.prototype.createBody = function (shape, position) {
        // Define body
        var bodyDef = new b2.BodyDef;
        bodyDef.type = b2.BodyType.dynamicBody;
        bodyDef.userData = this.body_index;
        var body = this.world.CreateBody(bodyDef);
        // Define fixture
        var fixDef = new b2.FixtureDef;
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
        return this.body_index - 1;
    };
    PhysicsHandler.prototype.destroyBody = function (body_index) {
        var body = this.bodies[body_index];
        this.world.DestroyBody(body);
        delete this.bodies[body_index];
    };
    return PhysicsHandler;
}(handler_1.Handler));
PhysicsHandler.gravity = new b2.Vec2(0, -9.8);
exports.PhysicsHandler = PhysicsHandler;
//# sourceMappingURL=physics.handler.js.map