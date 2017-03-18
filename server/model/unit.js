"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var b2 = require('lucy-b2');
var Unit = (function () {
    function Unit(position, speed, health, walkType, elementType, owner) {
        this.position = position;
        this.speed = speed;
        this.health = health;
        this.walkType = walkType;
        this.elementType = elementType;
        this.owner = owner;
    }
    Unit.prototype.update = function () {
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
    };
    Unit.prototype.setBody = function (world) {
        // Define body
        var bodyDef = new b2.BodyDef;
        bodyDef.type = b2.BodyType.dynamicBody;
        this.body = world.CreateBody(bodyDef);
        // Define fixture
        var fixDef = new b2.FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.2;
        fixDef.restitution = 0.8;
        var shape = new b2.PolygonShape;
        shape.SetAsBox(0.1, 0.1);
        fixDef.shape = shape;
        // Create fixture
        this.body.CreateFixture(fixDef);
        // Move body into initial position ( and rotation )
        this.body.SetTransform(0, 2, 0);
    };
    Unit.prototype.destroyBody = function (world) {
        world.DestroyBody(this.body);
    };
    return Unit;
}());
exports.Unit = Unit;
