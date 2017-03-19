"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var index_1 = require("./routes/index");
var index_2 = require("./rooms/index");
var app_const_1 = require("./constants/app.const");
var http_1 = require("http");
var app = express();
var httpServer = http_1.createServer(app);
index_1.RouteManager.init(app);
index_2.RoomManager.init(httpServer);
httpServer.listen(app_const_1.AppConstants.port, function () {
    console.log("Listening on http://localhost:" + app_const_1.AppConstants.port);
});
//# sourceMappingURL=index.js.map