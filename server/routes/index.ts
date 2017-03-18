import * as express from 'express';
import { AppConstants } from '../constants/app.const';

export class RouteManager {
  static init(app: express.Application) {
    app.use(express.static(AppConstants.root + AppConstants.clientFiles));

    app.get('/getPort', function(req, res){
      console.log('ask for port');
      res.json({port: AppConstants.port});
    });

    app.get('/', function (req, res) {
      res.sendFile(AppConstants.root + AppConstants.clientFiles + '/index.html');
    });
  }
};