import { Handler } from './handler';

export class ChatHandler extends Handler{
    messages: string[] = [];

    onJoin(player) {
        this.messages.push('Player ' + player.id + ' joined.');
    }

    onLeave(player) {
        this.messages.push('Player ' + player.id + ' exited.');
    }
    
    onMessage(player, data) {
        this.messages.push(player.id + ' ' + ' ' + data.message);
    }

    toJSON() {
        return {
            messages: this.messages
        };
    }
}