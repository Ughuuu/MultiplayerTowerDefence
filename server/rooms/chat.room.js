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
var ChatRoom = (function (_super) {
    __extends(ChatRoom, _super);
    function ChatRoom(options) {
        var _this = _super.call(this, options) || this;
        _this.setPatchRate(200);
        _this.setState({ messages: [] });
        console.log("ChatRoom created!", options);
        return _this;
    }
    ChatRoom.prototype.onJoin = function (client) {
        this.state.messages.push(client.id + " joined.");
    };
    ChatRoom.prototype.onLeave = function (client) {
        this.state.messages.push(client.id + " left.");
    };
    ChatRoom.prototype.onMessage = function (client, data) {
        if (typeof data == 'string') {
            data = JSON.parse(data);
        }
        this.state.messages.push(client.id + ':' + data.message);
    };
    ChatRoom.prototype.onDispose = function () {
        console.log("Dispose ChatRoom");
    };
    ChatRoom.prototype.requestJoin = function (options) {
        return this.clients.length < 10;
    };
    return ChatRoom;
}(colyseus_1.Room));
exports.ChatRoom = ChatRoom;
