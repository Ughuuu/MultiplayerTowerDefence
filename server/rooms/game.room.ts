import { Room, Client } from "colyseus";
import { StateHandler } from "../controller/state.handler";
import { PhysicsHandler } from "../controller/physics.handler";
import { ChatHandler } from "../controller/chat.handler";
import { UnitBuilder } from "../builders/unit.builder";
import { TowerBuilder } from "../builders/tower.builder";
import { ProjectileBuilder } from "../builders/projectile.builder";
import { MapHandler } from "../controller/map.handler";
import { MoneyHandler } from "../controller/money.handler";
import { RoomManager } from './index';

export class GameRoom extends Room<StateHandler> {
    static patch: number = 1000 / 60;
    static fps: number = 1000 / 30;
    static ms: number = 1 / 30;
    private password: string;
    invervalId: number;
    started: boolean = false;

    addHandlers(stateHandler: StateHandler): StateHandler {
        stateHandler.addHandler(new PhysicsHandler());
        stateHandler.addHandler(new ChatHandler());
        stateHandler.addHandler(new MoneyHandler());
        stateHandler.addHandler(new MapHandler(this.options.map));
        return stateHandler;
    }

    addBuilders(stateHandler: StateHandler): StateHandler {
        stateHandler.addBuilder(new UnitBuilder(stateHandler.handlers['PhysicsHandler'], stateHandler.players));
        stateHandler.addBuilder(new TowerBuilder(stateHandler.handlers['PhysicsHandler'], stateHandler.players));
        stateHandler.addBuilder(new ProjectileBuilder(stateHandler.handlers['PhysicsHandler'], stateHandler.builders['TowerBuilder'], stateHandler.players))
        return stateHandler;
    }

    constructor(options) {
        super(options);
        this.setPatchRate(GameRoom.patch);
        this.setState(this.addBuilders(this.addHandlers(new StateHandler(options.maxPlayers))));
        var debug = true;
        RoomManager.rooms++;
    }

    update() {
        var gameRoom: GameRoom = this;
        this.state.update(gameRoom);
    }

    onJoin(client: Client, options) {
        RoomManager.players++;
        if (options.name == null) {
            options.name = client.id;
        }
        this.state.onJoin(client, options);
    }

    onLeave(client: Client) {
        RoomManager.players--;
        this.state.onLeave(client);
    }

    onMessage(client: Client, data) {
        if (this.started == true)
            this.state.onMessage(client, data, this)
    }

    onDispose() {
        RoomManager.rooms--;
        clearInterval(this.invervalId);
        this.state.onDispose();
    }

    requestJoin(options) {
        if (this.options.isPasswordRequired == true) {
            // first player to join sets the pasword
            if (options.password != null && this.clients.length == 0) {
                this.password = options.password;
                return true;
            }
            // same password, let him connect
            if (options.password != null && options.password == this.password && this.clients.length < this.options.maxPlayers) {
                // start server if all players joined
                if (this.clients.length == this.options.maxPlayers - 1) {
                    this.started = true;
                        this.setSimulationInterval(function () { this.update() }.bind(this), GameRoom.fps);
                }
                return true;
            }
            return false;
        }
        // start server if all players joined
        if (this.clients.length == this.options.maxPlayers - 1) {
            this.started = true;
            this.setSimulationInterval(function () { this.update() }.bind(this), GameRoom.fps);
        }
        return this.clients.length < this.options.maxPlayers;
    }
}