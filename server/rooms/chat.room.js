"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var colyseus_1 = require("colyseus");
var state_handler_1 = require("../controller/state.handler");
var ChatRoom = (function (_super) {
    __extends(ChatRoom, _super);
    function ChatRoom(options) {
        var _this = _super.call(this, options) || this;
        _this.setPatchRate(1000);
        _this.setState(new state_handler_1.StateHandler());
        console.log("ChatRoom created!", options);
        return _this;
    }
    ChatRoom.prototype.onJoin = function (client) {
        this.state.onJoin(client);
    };
    ChatRoom.prototype.onLeave = function (client) {
        this.state.onLeave(client);
    };
    ChatRoom.prototype.onMessage = function (client, data) {
        this.state.onMessage(client, data);
    };
    ChatRoom.prototype.onDispose = function () {
    };
    return ChatRoom;
}(colyseus_1.Room));
exports.ChatRoom = ChatRoom;
//# sourceMappingURL=chat.room.js.map