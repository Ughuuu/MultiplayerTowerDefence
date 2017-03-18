"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppConstants = (function () {
    function AppConstants() {
    }
    return AppConstants;
}());
AppConstants.root = process.cwd();
AppConstants.mode = (process.env.NODE_ENV === 'production') ? true : false;
AppConstants.clientFiles = '/client/';
AppConstants.port = process.env.PORT || 3333;
exports.AppConstants = AppConstants;
