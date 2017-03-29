import { Handler } from './handler';
import { Player } from '../model/player';
import { Point } from '../model/point';
import { Builder } from '../builders/builder';
import { GameRoom } from '../rooms/game.room';

export class StateHandler {
    handlers = {};
    builders = {};
    players = {};
    player_size: number = 0;
    locations = {};

    public constructor(public maxPlayers) {

    }

    getPlayerByLocation(location: number) {
        return this.locations[location];
    }

    onJoin(client, options) {
        let positions: boolean[] = [];
        for (let i = 0; i < this.maxPlayers; i++) {
            positions.push(false);
        }
        for (let key in this.players) {
            positions[this.players[key].location] = true;
        }
        let i = 0;
        for (; i < this.maxPlayers; i++) {
            if (positions[i] == false) {
                break;
            }
        }
        this.player_size++;
        let player = new Player(client.id, client, options.name, i);
        this.players[client.id] = player;
        for (let key in this.handlers) {
            this.handlers[key].onJoin(player, this.handlers, this.builders);
        }
        this.locations[player.location] = player;
    }

    onLeave(client) {
        this.player_size--;
        let player = this.players[client.id];
        for (let key in this.handlers) {
            this.handlers[key].onLeave(player, this.handlers, this.builders);
        }
        delete this.locations[player.location];
        delete this.players[client.id];
    }

    onMessage(client, data, gameRoom: GameRoom) {
        let player = this.players[client.id];
        for (let key in this.handlers) {
            let handler = this.handlers[key];
            let handlerData = data[handler.name];
            if (handlerData != null)
                handler.onMessage(player, handlerData, this.handlers, this.builders, gameRoom);
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
        result['players'] = {};
        for (let key in this.locations) {
            result['players'][this.locations[key].id] = { location: this.locations[key].location, life: this.locations[key].life };
        }
        return result;
    }

    onDispose() {
        this.player_size = 0;
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