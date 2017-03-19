import { Room } from "colyseus";
import { StateHandler } from "../controller/state.handler";
import { PhysicsHandler } from "../controller/physics.handler";
import { ChatHandler } from "../controller/chat.handler";
import { MapHandler } from "../controller/map.handlter"

export class GameRoom extends Room<StateHandler> {
    static fps: number = 1000 / 30;
    static ms: number = 1 / 30;

    addHandlers(stateHandler: StateHandler): StateHandler{
        stateHandler.addHandler(new PhysicsHandler());
        stateHandler.addHandler(new ChatHandler());
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
        this.setPatchRate(GameRoom.fps);
        this.setState(this.addHandlers(new StateHandler()));
        setInterval(this.update.bind(this), GameRoom.fps);
    }

    update() {
        this.state.update();
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
        this.state.onDispose();
    }
}