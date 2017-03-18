import { Handler } from './handler';
import { Player } from '../model/player';

export class StateHandler{
    handlers: Handler[] = [];
    players = {};

    onJoin(client) {
        let player = new Player(client.id, '');
        this.players[client.id] = player;
        for(let handler of this.handlers){
            handler.onJoin(player);
        }
    }

    onLeave(client) {
        let player = this.players[client.id];
        for(let handler of this.handlers){
            handler.onLeave(player);
        }
        delete this.players[client.id];
    }

    onMessage(client, data) {
        let player = this.players[client.id];
        for(let handler of this.handlers){
            handler.onMessage(player, data);
        }
    }

    update(){
        for(let handler of this.handlers){
            handler.update(this.players);
        }
    }

    toJSON() {
        let result = {};
        for(let handler of this.handlers){
            let handlerJSON = handler.toJSON();
            for(let key in handlerJSON){
                result[key] = handlerJSON[key];
            }
        }
        return result;
    }

    onDispose(){        
        for(let handler of this.handlers){
            handler.onDispose(this.players);
        }
    }

    addHandler(handler: Handler){
        this.handlers.push(handler);
    }
}