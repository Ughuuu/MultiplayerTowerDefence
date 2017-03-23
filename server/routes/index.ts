import * as express from 'express';
import { AppConstants } from '../constants/app.const';
import { RoomManager } from '../rooms/index';

export class RouteManager {
  static init(app: express.Application) {
    app.use(express.static(AppConstants.root + AppConstants.clientFiles));

    app.get('/', function (req, res) {
      res.sendFile(AppConstants.root + AppConstants.clientFiles + 'index.html');
    });

    app.get('/statistics', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ rooms: RoomManager.rooms, players: RoomManager.players }));
    });

    app.get('/makeRoom:password', function (req, res) {
      req.parameters.password
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ rooms: RoomManager.rooms, players: RoomManager.players }));
    });
  }
};