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
var colyseus_1 = require("colyseus");
var state_handler_1 = require("../controller/state.handler");
var physics_handler_1 = require("../controller/physics.handler");
var chat_handler_1 = require("../controller/chat.handler");
var unit_builder_1 = require("../builders/unit.builder");
var tower_builder_1 = require("../builders/tower.builder");
var GameRoom = (function (_super) {
    __extends(GameRoom, _super);
    function GameRoom(options) {
        var _this = _super.call(this, options) || this;
        console.log("Room Created", options);
        _this.setPatchRate(GameRoom.fps);
        _this.setState(_this.addBuilders(_this.addHandlers(new state_handler_1.StateHandler())));
        _this.setSimulationInterval(function () { this.update(); }.bind(_this), GameRoom.fps);
        return _this;
    }
    GameRoom.prototype.addHandlers = function (stateHandler) {
        stateHandler.addHandler(new physics_handler_1.PhysicsHandler());
        stateHandler.addHandler(new chat_handler_1.ChatHandler());
        return stateHandler;
    };
    GameRoom.prototype.addBuilders = function (stateHandler) {
        stateHandler.addBuilder(new unit_builder_1.UnitBuilder(stateHandler.handlers['PhysicsHandler']));
        stateHandler.addBuilder(new tower_builder_1.TowerBuilder(stateHandler.handlers['PhysicsHandler']));
        return stateHandler;
    };
    GameRoom.prototype.update = function () {
        var gameRoom = this;
        this.state.update(gameRoom);
    };
    GameRoom.prototype.onJoin = function (client) {
        this.state.onJoin(client);
    };
    GameRoom.prototype.onLeave = function (client) {
        this.state.onLeave(client);
    };
    GameRoom.prototype.onMessage = function (client, data) {
        this.state.onMessage(client, data);
    };
    GameRoom.prototype.onDispose = function () {
        clearInterval(this.invervalId);
        this.state.onDispose();
    };
    return GameRoom;
}(colyseus_1.Room));
GameRoom.fps = 1000 / 30;
GameRoom.ms = 1 / 30;
exports.GameRoom = GameRoom;
//# sourceMappingURL=game.room.js.map