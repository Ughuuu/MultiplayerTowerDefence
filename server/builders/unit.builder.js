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
var unit_1 = require("../model/unit");
var element_type_1 = require("../model/element.type");
var builder_1 = require("./builder");
var UnitType = (function () {
    function UnitType(name, texture, radius, health, damage, elementType, speed, armor, walkType) {
        this.name = name;
        this.texture = texture;
        this.radius = radius;
        this.health = health;
        this.damage = damage;
        this.elementType = elementType;
        this.speed = speed;
        this.armor = armor;
        this.walkType = walkType;
    }
    return UnitType;
}());
exports.UnitType = UnitType;
var UnitBuilder = (function (_super) {
    __extends(UnitBuilder, _super);
    function UnitBuilder(physicsHandler) {
        var _this = _super.call(this, 'UnitBuilder') || this;
        _this.physicsHandler = physicsHandler;
        _this.units = {};
        return _this;
    }
    UnitBuilder.prototype.create = function (type, owner_id, position) {
        var unit_type = UnitBuilder.types[type];
        var circleShape = this.physicsHandler.createCircle(unit_type.radius);
        var body_id = this.physicsHandler.createBody(circleShape, position);
        var unit = new unit_1.Unit(body_id, owner_id);
        unit.health = unit_type.health;
        unit.damage = unit_type.damage;
        unit.elementType = unit_type.elementType;
        unit.type = type;
        unit.speed = unit_type.speed;
        unit.armor = unit_type.armor;
        unit.walkType = unit_type.walkType;
        this.units[unit.id] = unit;
        return unit.id;
    };
    UnitBuilder.prototype.get = function (id) {
        return this.units[id];
    };
    UnitBuilder.prototype.remove = function (id) {
        this.physicsHandler.destroyBody(id);
        delete this.units[id];
    };
    return UnitBuilder;
}(builder_1.Builder));
UnitBuilder.types = [
    new UnitType('light_creep', 'creep_texture.png', 0.1, 10, 15, element_type_1.ElementType.Normal, 1, 0, unit_1.WalkType.Ground)
];
exports.UnitBuilder = UnitBuilder;
//# sourceMappingURL=unit.builder.js.map