import { Room } from "colyseus";
import { StateHandler } from "../controller/state.handler"

export class ChatRoom extends Room<any> {
    constructor(options) {
        super(options);
        this.setPatchRate(1000);
        this.setState(new StateHandler());
        console.log("ChatRoom created!", options);
    }

    onJoin(client) {
        this.state.onJoin(client);
    }

    onLeave(client) {
        this.state.onLeave(client);
    }
    onMessage(client, data) {
        this.state.onMessage(client,data)
    }

  onDispose () {
  }
}