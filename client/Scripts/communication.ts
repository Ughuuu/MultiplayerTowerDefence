class Communication {
    client: any;
    state: any;
    constructor(client) {
        this.state = null;
        this.client = client;
    } 
    joinRoom(room) {
        var gameRoom = this.client.join(room);
        gameRoom.onJoin.add(this.onJoin);
        
        gameRoom.onUpdate.add(this.update);
        gameRoom.state.listen(this.listen);
    }
    sendMessage(message) { 
        console.log('Send', message);
        this.client.send(message);
    }
    update(state) {
        console.log(state);
    }
    listen(number,message) {
        console.log('listen',number, message);
    }
    onJoin(client, room){
        console.log(client, "joined", room);
    }
}