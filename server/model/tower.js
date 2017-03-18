"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tower = (function () {
    function Tower(position, health, elementType, owner) {
        this.position = position;
        this.health = health;
        this.elementType = elementType;
        this.owner = owner;
    }
    Tower.prototype.update = function () {
    };
    return Tower;
}());
exports.Tower = Tower;
