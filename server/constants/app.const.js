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
AppConstants.keymetrics_private = AppConstants.mode ? process.env.KEYMETRICS_PRIVATE : 's20pmskbqcxc6oi';
AppConstants.keymetrics_public = AppConstants.mode ? process.env.KEYMETRICS_PUBLIC : '7dbbz6e6nxhaevd';
exports.AppConstants = AppConstants;
