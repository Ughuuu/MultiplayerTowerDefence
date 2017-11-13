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

    addHandlers(stateHandler: StateHandler, options): StateHandler {
        stateHandler.addHandler(new PhysicsHandler());
        stateHandler.addHandler(new ChatHandler());
        stateHandler.addHandler(new MoneyHandler());
        stateHandler.addHandler(new MapHandler(options.map));
        return stateHandler;
    }

    addBuilders(stateHandler: StateHandler): StateHandler {
        stateHandler.addBuilder(new UnitBuilder(stateHandler.handlers['PhysicsHandler'], stateHandler.players));
        stateHandler.addBuilder(new TowerBuilder(stateHandler.handlers['PhysicsHandler'], stateHandler.players));
        stateHandler.addBuilder(new ProjectileBuilder(stateHandler.handlers['PhysicsHandler'], stateHandler.builders['TowerBuilder'], stateHandler.players))
        return stateHandler;
    }

    onInit(options) {
        this.patchRate = GameRoom.patch;
        this.maxClients = options.maxClients;
        this.setState(this.addBuilders(this.addHandlers(new StateHandler(options.maxClients), options)));
        var debug = true;
        RoomManager.rooms++;
    }

    update() {
        var gameRoom: GameRoom = this;
        this.state.update(gameRoom);
    }

    onJoin(client: Client, options) {
    	console.log("onJoin: " + client);
        RoomManager.players++;
        if (options.name == null) {
            options.name = client.id;
        }
        this.state.onJoin(client, options);
    }

    onLeave(client: Client) {
    	console.log("onLeave: " + client);
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

/*
    requestJoin(options) {
        if (this.started == true) {
            //return 0;
        }
        // start server if all players joined
        if (this.clients.length == this.maxClients - 1) {
            this.started = true;
            this.setSimulationInterval(function () { this.update() }.bind(this), GameRoom.fps);
        }
        return true;
        //return 1;
    }
    */
}