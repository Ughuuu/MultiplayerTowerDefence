import { Handler } from './handler';
import { Player } from '../model/player';
import { Builder } from '../builders/builder';
import { GameRoom } from '../rooms/game.room';

export class StateHandler {
    handlers = {};
    builders = {};
    players = {};

    onJoin(client) {
        let player = new Player(client.id, '');
        this.players[client.id] = player;
        for (let key in this.handlers) {
            this.handlers[key].onJoin(player, this.handlers, this.builders);
        }
    }

    onLeave(client) {
        let player = this.players[client.id];
        for (let key in this.handlers) {
            this.handlers[key].onLeave(player, this.handlers, this.builders);
        }
        delete this.players[client.id];
    }

    onMessage(client, data) {
        let player = this.players[client.id];
        for (let key in this.handlers) {
            let handler = this.handlers[key];
            let handlerData = data[handler.name];
            if(handlerData != null)
            handler.onMessage(player, handlerData, this.handlers, this.builders);
        }
    }

    update(gameRoom: GameRoom) {
        for (let key in this.handlers) {
            this.handlers[key].update(this.players, gameRoom, this.handlers, this.builders);
        }
    }

    toJSON() {
        let result = {};
        for (let key in this.handlers) {
            let handlerJSON = this.handlers[key].toJSON(this.players, this.handlers, this.builders);
            for (let key in handlerJSON) {
                result[key] = handlerJSON[key];
            }
        }
        return result;
    }

    onDispose() {
        for (let key in this.handlers) {
            this.handlers[key].onDispose(this.players, this.handlers, this.builders);
        }
    }

    addHandler(handler: Handler) {
        this.handlers[handler.name] = handler;
    }

    addBuilder(builder: Builder) {
        this.builders[builder.name] = builder;
    }
}