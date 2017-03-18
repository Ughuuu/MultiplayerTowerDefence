"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = (function () {
    function Player(id, name) {
        this.towers = [];
        this.units = [];
        this.id = id;
        this.name = name;
    }
    Player.prototype.update = function () {
        for (var _i = 0, _a = this.towers; _i < _a.length; _i++) {
            var tower = _a[_i];
            tower.update();
        }
    };
    return Player;
}());
exports.Player = Player;
