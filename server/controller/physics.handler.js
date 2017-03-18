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
var b2 = require('lucy-b2');
var PhysicsHandler = (function (_super) {
    __extends(PhysicsHandler, _super);
    function PhysicsHandler() {
        var _this = _super.call(this) || this;
        _this.world = new b2.World(PhysicsHandler.gravity);
        return _this;
    }
    PhysicsHandler.prototype.onJoin = function (player) {
    };
    PhysicsHandler.prototype.onLeave = function (player) {
        for (var _i = 0, _a = player.units; _i < _a.length; _i++) {
            var unit = _a[_i];
            unit.destroyBody(this.world);
        }
    };
    PhysicsHandler.prototype.onMessage = function (player, data) {
        // TO DO
    };
    PhysicsHandler.prototype.update = function (players) {
        this.world.Step(game_room_1.GameRoom.ms, 10, 10);
    };
    PhysicsHandler.prototype.toJSON = function () {
        return {};
    };
    PhysicsHandler.prototype.onDispose = function (players) {
        for (var _i = 0, players_1 = players; _i < players_1.length; _i++) {
            var player = players_1[_i];
            for (var _a = 0, _b = player.units; _a < _b.length; _a++) {
                var unit = _b[_a];
                unit.destroyBody(this.world);
            }
        }
    };
    return PhysicsHandler;
}(handler_1.Handler));
PhysicsHandler.gravity = new b2.Vec2(0, -9.8);
exports.PhysicsHandler = PhysicsHandler;
