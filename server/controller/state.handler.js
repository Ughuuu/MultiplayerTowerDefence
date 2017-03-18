"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var player_1 = require("../model/player");
var StateHandler = (function () {
    function StateHandler() {
        this.handlers = [];
        this.players = {};
    }
    StateHandler.prototype.onJoin = function (client) {
        var player = new player_1.Player(client.id, '');
        this.players[client.id] = player;
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.onJoin(player);
        }
    };
    StateHandler.prototype.onLeave = function (client) {
        var player = this.players[client.id];
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.onLeave(player);
        }
        delete this.players[client.id];
    };
    StateHandler.prototype.onMessage = function (client, data) {
        var player = this.players[client.id];
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.onMessage(player, data);
        }
    };
    StateHandler.prototype.update = function () {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.update(this.players);
        }
    };
    StateHandler.prototype.toJSON = function () {
        var result = {};
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            var handlerJSON = handler.toJSON();
            for (var key in handlerJSON) {
                result[key] = handlerJSON[key];
            }
        }
        return result;
    };
    StateHandler.prototype.onDispose = function () {
        for (var _i = 0, _a = this.handlers; _i < _a.length; _i++) {
            var handler = _a[_i];
            handler.onDispose(this.players);
        }
    };
    StateHandler.prototype.addHandler = function (handler) {
        this.handlers.push(handler);
    };
    return StateHandler;
}());
exports.StateHandler = StateHandler;
