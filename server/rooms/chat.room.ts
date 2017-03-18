import { Room } from "colyseus";
//import { StateHandler } from "../Game Logic/StateHandler"

export class ChatRoom extends Room<any> {
    //stateHandler: StateHandler;
  constructor ( options ) {
    super( options );
    this.setPatchRate(1000);
    //this.stateHandler = new StateHandler();
    this.setState({messages : []});
    console.log("ChatRoom created!", options);
  }

  onJoin(client) {
     // this.state.addPlayer(client);
  }

  onLeave(client) {
     // this.state.removePlayer(client);
  }

  onMessage(client, data) {
      this.state.messages.push(client.id + ':' + data.message);
      console.log("ChatRoom:", client.id, data);
  }

  onDispose () {
    console.log("Dispose ChatRoom");
  }
}