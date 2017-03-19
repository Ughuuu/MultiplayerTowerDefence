"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("../model/player");
var StateHandler = (function () {
    function StateHandler() {
        this.handlers = {};
        this.builders = {};
        this.players = {};
    }
    StateHandler.prototype.onJoin = function (client) {
        var player = new player_1.Player(client.id, '');
        this.players[client.id] = player;
        for (var key in this.handlers) {
            this.handlers[key].onJoin(player, this.handlers, this.builders);
        }
    };
    StateHandler.prototype.onLeave = function (client) {
        var player = this.players[client.id];
        for (var key in this.handlers) {
            this.handlers[key].onLeave(player, this.handlers, this.builders);
        }
        delete this.players[client.id];
    };
    StateHandler.prototype.onMessage = function (client, data) {
        var player = this.players[client.id];
        for (var key in this.handlers) {
            var handler = this.handlers[key];
            var handlerData = data[handler.name];
            if (handlerData != null)
                handler.onMessage(player, handlerData, this.handlers, this.builders);
        }
    };
    StateHandler.prototype.update = function (gameRoom) {
        for (var key in this.handlers) {
            this.handlers[key].update(this.players, gameRoom, this.handlers, this.builders);
        }
    };
    StateHandler.prototype.toJSON = function () {
        var result = {};
        for (var key in this.handlers) {
            var handlerJSON = this.handlers[key].toJSON(this.players, this.handlers, this.builders);
            for (var key_1 in handlerJSON) {
                result[key_1] = handlerJSON[key_1];
            }
        }
        return result;
    };
    StateHandler.prototype.onDispose = function () {
        for (var key in this.handlers) {
            this.handlers[key].onDispose(this.players, this.handlers, this.builders);
        }
    };
    StateHandler.prototype.addHandler = function (handler) {
        this.handlers[handler.name] = handler;
    };
    StateHandler.prototype.addBuilder = function (builder) {
        this.builders[builder.name] = builder;
    };
    return StateHandler;
}());
exports.StateHandler = StateHandler;
//# sourceMappingURL=state.handler.js.map