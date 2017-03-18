"use strict";
var express = require("express");
var app_const_1 = require("../constants/app.const");
var RouteManager = (function () {
    function RouteManager() {
    }
    RouteManager.init = function (app) {
        app.use(express.static(app_const_1.AppConstants.root + app_const_1.AppConstants.clientFiles));
        app.get('/', function (req, res) {
            res.sendFile(app_const_1.AppConstants.root + app_const_1.AppConstants.clientFiles + 'index.html');
        });
    };
    return RouteManager;
}());
exports.RouteManager = RouteManager;
;
//# sourceMappingURL=index.js.map