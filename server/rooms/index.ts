import { Server } from 'colyseus';
import * as path from 'path';

import { GameRoom } from './game.room';

export class RoomManager {
  static init(httpServer) {
    let gameServer = new Server({ server: httpServer });
    gameServer.register("game", GameRoom);
  }
}