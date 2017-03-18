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
var handler_1 = require("./handler");
var ChatHandler = (function (_super) {
    __extends(ChatHandler, _super);
    function ChatHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.messages = [];
        return _this;
    }
    ChatHandler.prototype.onJoin = function (player) {
        console.log(player);
        this.messages.push('Player ' + player.id + ' joined.');
    };
    ChatHandler.prototype.onLeave = function (player) {
        this.messages.push('Player ' + player.id + ' exited.');
    };
    ChatHandler.prototype.onMessage = function (player, data) {
        this.messages.push(player.id + ' ' + ' ' + data.message);
    };
    ChatHandler.prototype.toJSON = function () {
        return {
            messages: this.messages
        };
    };
    return ChatHandler;
}(handler_1.Handler));
exports.ChatHandler = ChatHandler;
