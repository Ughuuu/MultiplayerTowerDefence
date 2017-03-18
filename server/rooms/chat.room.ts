import { Room } from "colyseus";
import { StateHandler } from "../Controller/StateHandler"

export class ChatRoom extends Room<any> {
    //stateHandler: StateHandler;
    constructor(options) {
        super(options);
        this.setPatchRate(1000);
        statehandler:StateHandler = new StateHandler();
        this.setState(statehandler);
        console.log("ChatRoom created!", options);
    }

    onJoin(client) {
        this.state.onJoin(client);
    }

    onLeave(client) {
        this.state.onLeave(client);
    }
    update(){

    }
  onMessage(client, data) {
      this.state.onMessage(client,data)
  }

  onDispose () {
  }
}