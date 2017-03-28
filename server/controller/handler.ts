import { Player } from '../model/player';
import { GameRoom } from '../rooms/game.room';

export abstract class Handler {
    constructor(public name: string) { }

    onJoin(player: Player, handlers, builders) { }
    onLeave(player: Player, handlers, builders) { }
    onMessage(player: Player, data, handlers, builders, gameRoom: GameRoom) { }
    onDispose(players, handlers, builders) { }
    update(players, gameRoom: GameRoom, handlers, builders) { }

    abstract toJSON(players, handlers, builders): any;
}