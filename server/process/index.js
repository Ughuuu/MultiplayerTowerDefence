"use strict";
var app_const_1 = require("../constants/app.const");
var pm2 = require('pm2');
var MACHINE_NAME = 'heroku_machine';
var instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
var maxMemory = process.env.WEB_MEMORY || 512;
var ProcessManager = (function () {
    function ProcessManager() {
    }
    ProcessManager.init = function () {
        pm2.connect(function () {
            pm2.start({
                script: 'index.js',
                name: 'app',
                exec_mode: 'cluster',
                instances: instances,
                max_memory_restart: maxMemory + 'M',
                env: {
                    "NODE_ENV": "production",
                    "AWESOME_SERVICE_API_TOKEN": "xxx"
                },
                post_update: ["npm install"] // Commands to execute once we do a pull from Keymetrics
            }, function () {
                pm2.interact(app_const_1.AppConstants.keymetrics_private, app_const_1.AppConstants.keymetrics_public, MACHINE_NAME, function () {
                    // Display logs in standard output 
                    pm2.launchBus(function (err, bus) {
                        console.log('[PM2] Log streaming started');
                        bus.on('log:out', function (packet) {
                            console.log('[App:%s] %s', packet.process.name, packet.data);
                        });
                        bus.on('log:err', function (packet) {
                            console.error('[App:%s][Err] %s', packet.process.name, packet.data);
                        });
                    });
                });
            });
        });
    };
    return ProcessManager;
}());
exports.ProcessManager = ProcessManager;
//# sourceMappingURL=index.js.map