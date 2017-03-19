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
var tower_1 = require("../model/tower");
var element_type_1 = require("../model/element.type");
var builder_1 = require("./builder");
var TowerType = (function () {
    function TowerType(name, texture, radius, health, damage, elementType, speed) {
        this.name = name;
        this.texture = texture;
        this.radius = radius;
        this.health = health;
        this.damage = damage;
        this.elementType = elementType;
        this.speed = speed;
    }
    return TowerType;
}());
exports.TowerType = TowerType;
var TowerBuilder = (function (_super) {
    __extends(TowerBuilder, _super);
    function TowerBuilder(physicsHandler) {
        var _this = _super.call(this, 'TowerBuilder') || this;
        _this.physicsHandler = physicsHandler;
        _this.towers = {};
        return _this;
    }
    TowerBuilder.prototype.create = function (type, owner_id, position) {
        var tower_type = TowerBuilder.types[type];
        var boxShape = this.physicsHandler.createBox(tower_type.radius, tower_type.radius);
        var body_id = this.physicsHandler.createBody(boxShape, position);
        var tower = new tower_1.Tower(body_id, owner_id);
        tower.health = tower_type.health;
        tower.damage = tower_type.damage;
        tower.elementType = tower_type.elementType;
        tower.speed = tower_type.speed;
        tower.type = type;
        this.towers[tower.id] = tower;
        return tower.id;
    };
    TowerBuilder.prototype.get = function (id) {
        return this.towers[id];
    };
    TowerBuilder.prototype.remove = function (id) {
        this.physicsHandler.destroyBody(id);
        delete this.towers[id];
    };
    return TowerBuilder;
}(builder_1.Builder));
TowerBuilder.types = [
    new TowerType('light_tower', 'light_tower.png', 0.1, 10, 15, element_type_1.ElementType.Normal, 1)
];
exports.TowerBuilder = TowerBuilder;
//# sourceMappingURL=tower.builder.js.map