"use strict";
var colyseus_1 = require("colyseus");
var chat_room_1 = require("./chat.room");
var RoomManager = (function () {
    function RoomManager() {
    }
    RoomManager.init = function (httpServer) {
        var gameServer = new colyseus_1.Server({ server: httpServer });
        gameServer.register("chat", chat_room_1.ChatRoom);
    };
    return RoomManager;
}());
exports.RoomManager = RoomManager;
//# sourceMappingURL=index.js.map