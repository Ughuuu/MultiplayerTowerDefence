"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handler = (function () {
    function Handler() {
    }
    Handler.prototype.onJoin = function (player) { };
    Handler.prototype.onLeave = function (player) { };
    Handler.prototype.onMessage = function (player, data) { };
    Handler.prototype.onDispose = function (players) { };
    Handler.prototype.update = function (players) { };
    return Handler;
}());
exports.Handler = Handler;
