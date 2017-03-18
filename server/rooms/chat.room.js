"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var colyseus_1 = require("colyseus");
//import { StateHandler } from "../Game Logic/StateHandler"
var ChatRoom = (function (_super) {
    __extends(ChatRoom, _super);
    //stateHandler: StateHandler;
    function ChatRoom(options) {
        var _this = _super.call(this, options) || this;
        _this.setPatchRate(1000);
        //this.stateHandler = new StateHandler();
        _this.setState({ messages: [] });
        console.log("ChatRoom created!", options);
        return _this;
    }
    ChatRoom.prototype.onJoin = function (client) {
        // this.state.addPlayer(client);
    };
    ChatRoom.prototype.onLeave = function (client) {
        // this.state.removePlayer(client);
    };
    ChatRoom.prototype.onMessage = function (client, data) {
        this.state.messages.push(client.id + ':' + data.message);
        console.log("ChatRoom:", client.id, data);
    };
    ChatRoom.prototype.onDispose = function () {
        console.log("Dispose ChatRoom");
    };
    return ChatRoom;
}(colyseus_1.Room));
exports.ChatRoom = ChatRoom;
//# sourceMappingURL=chat.room.js.map