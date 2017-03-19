"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WalkType;
(function (WalkType) {
    WalkType[WalkType["Ground"] = 0] = "Ground";
    WalkType[WalkType["Flying"] = 1] = "Flying";
})(WalkType = exports.WalkType || (exports.WalkType = {}));
var Unit = (function () {
    function Unit(id, owner_id) {
        this.id = id;
        this.owner_id = owner_id;
    }
    return Unit;
}());
exports.Unit = Unit;
//# sourceMappingURL=unit.js.map