import { Handler } from './handler';
import { GameRoom } from '../rooms/game.room';

export class ChatHandler extends Handler{
    messages: string[] = [];

    constructor(){
        super('ChatHandler');
    }

    onJoin(player) {
        this.messages.push('Player ' + player.id + ' joined.');
    }

    onLeave(player) {
        this.messages.push('Player ' + player.id + ' exited.');
    }
    
    onMessage(player, data) {
        this.messages.push(player.id + ' ' + ' ' + data);
    }

    update(players, gameRoom: GameRoom, handlers, builders) {
        //gameRoom.broadcast(this.toJSON(players, handlers, builders));
    }

    toJSON(players, handlers, builders) {
        return {
            messages: this.messages
        };
    }
}