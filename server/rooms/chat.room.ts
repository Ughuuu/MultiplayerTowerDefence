import { Room } from "colyseus";

export class ChatRoom extends Room<any> {
  constructor ( options ) {
    super( options );
    this.setPatchRate( 200 );
    this.setState({ messages: [] });
    console.log("ChatRoom created!", options);
  }

  onJoin (client) {
    this.state.messages.push(`${ client.id } joined.`);
  }

  onLeave (client) {
    this.state.messages.push(`${ client.id } left.`);
  }

  onMessage (client, data) {
    if(typeof data == 'string'){
      data = JSON.parse(data);
    }
    this.state.messages.push(client.id + ':' + data.message);
  }

  onDispose () {
    console.log("Dispose ChatRoom");
  }
  
  requestJoin(options) {
    return this.clients.length < 10;
  }
}