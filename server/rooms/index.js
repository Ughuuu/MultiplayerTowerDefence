"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var colyseus_1 = require("colyseus");
var game_room_1 = require("./game.room");
var RoomManager = (function () {
    function RoomManager() {
    }
    RoomManager.init = function (httpServer) {
        var gameServer = new colyseus_1.Server({ server: httpServer });
        gameServer.register("game", game_room_1.GameRoom);
    };
    return RoomManager;
}());
exports.RoomManager = RoomManager;
//# sourceMappingURL=index.js.map