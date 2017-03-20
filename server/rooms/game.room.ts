import { Room } from "colyseus";
import { StateHandler } from "../controller/state.handler";
import { PhysicsHandler } from "../controller/physics.handler";
import { ChatHandler } from "../controller/chat.handler";
import { UnitBuilder } from "../builders/unit.builder";
import { TowerBuilder } from "../builders/tower.builder";
import { MapHandler } from "../controller/map.handler";

export class GameRoom extends Room<StateHandler> {
    static patch: number = 1000 / 10;
    static fps: number = 1000 / 30;
    static ms: number = 1 / 30;
    invervalId: number;

    addHandlers(stateHandler: StateHandler): StateHandler{
        stateHandler.addHandler(new PhysicsHandler());
        stateHandler.addHandler(new ChatHandler());
        return stateHandler;
    }

    addBuilders(stateHandler: StateHandler): StateHandler{
        stateHandler.addBuilder(new UnitBuilder(stateHandler.handlers['PhysicsHandler']));
        stateHandler.addBuilder(new TowerBuilder(stateHandler.handlers['PhysicsHandler']));
        var matrix = [
            [0, 0, 0, 1, 0],
            [1, 0, 0, 0, 1],
            [0, 0, 1, 0, 0],
        ];
        stateHandler.addHandler(new MapHandler(matrix));
        return stateHandler;
    }

    constructor(options) {
        super(options);
        console.log("Room Created", options);
        this.setPatchRate(GameRoom.patch);
        this.setState(this.addBuilders(this.addHandlers(new StateHandler())));
        this.setSimulationInterval(function() {this.update()}.bind(this), GameRoom.fps);
    }

    update() {
        var gameRoom: GameRoom = this;
        this.state.update(gameRoom);
    }

    onJoin(client) {
        this.state.onJoin(client);
    }

    onLeave(client) {
        this.state.onLeave(client);
    }

    onMessage(client, data) {
        this.state.onMessage(client, data)
    }

    onDispose() {
        clearInterval(this.invervalId);
        this.state.onDispose();
    }
}