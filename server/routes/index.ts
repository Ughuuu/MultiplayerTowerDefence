import * as express from 'express';
import { AppConstants } from '../constants/app.const';
import { RoomManager } from '../rooms/index';
import { UnitBuilder } from "../builders/unit.builder";
import { TowerBuilder } from "../builders/tower.builder";
import { Unit, WalkType } from '../model/unit';
import { ElementType } from '../model/element.type';

export class RouteManager {
  static init(app: express.Application) {
    app.use(express.static(AppConstants.root + AppConstants.clientFiles));

    app.get('/', function (req, res) {
      res.sendFile(AppConstants.root + AppConstants.clientFiles + 'index.html');
    });

    app.get('/statistics', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      let unitTypes = [];
      let towerTypes = [];
      UnitBuilder.types.forEach((value, i) => {
        unitTypes[i] = {
          name: value.name,
          radius: value.radius,
          health: value.health,
          elementType: ElementType[value.elementType],
          speed: value.speed,
          armor: value.armor,
          unitType: WalkType[value.walkType],
          price: value.price,
          income: value.income,
          bounty: value.bounty
        };
      });
      TowerBuilder.types.forEach((value, i) => {
        towerTypes[i] = {
          name: value.name,
          damage: value.damage,
          elementType: ElementType[value.elementType],
          attackSpeed: value.speed,
          price: value.price,
          range: value.range,
          explosionRadius: value.explosionRadius,
          projectileSpeed: value.projectileSpeed,
          upgradesFrom: value.upgradeFrom
        };
      });
      res.send(JSON.stringify(
        {
          rooms: RoomManager.rooms,
          players: RoomManager.players,
          units: unitTypes,
          towers: towerTypes,
        }, null, 4));
    });

    app.get('/makeRoom:password', function (req, res) {
      req.parameters.password
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ rooms: RoomManager.rooms, players: RoomManager.players }));
    });
  }
};