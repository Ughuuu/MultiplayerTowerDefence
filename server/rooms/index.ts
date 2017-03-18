import { Server } from 'colyseus';
import * as path from 'path';

import { ChatRoom } from './chat.room';

export class RoomManager {
  static init(httpServer) {
    let gameServer = new Server({ server: httpServer });
    gameServer.register("chat", ChatRoom);
  }
}