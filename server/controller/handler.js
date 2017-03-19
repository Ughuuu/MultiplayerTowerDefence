"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Handler = (function () {
    function Handler(name) {
        this.name = name;
    }
    Handler.prototype.onJoin = function (player, handlers, builders) { };
    Handler.prototype.onLeave = function (player, handlers, builders) { };
    Handler.prototype.onMessage = function (player, data, handlers, builders) { };
    Handler.prototype.onDispose = function (players, handlers, builders) { };
    Handler.prototype.update = function (players, gameRoom, handlers, builders) { };
    return Handler;
}());
exports.Handler = Handler;
//# sourceMappingURL=handler.js.map