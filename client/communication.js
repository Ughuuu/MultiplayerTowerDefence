class Communication {
    constructor(client) {
    }
    static CreateComunication(client) {
        Communication.state = null;
        Communication.client = client;
        console.log(client);
    }
    static joinRoom(room) {
        var gameRoom = Communication.client.join("game");
        gameRoom.onJoin.add(Communication.onJoin);
        gameRoom.onUpdate.add(Communication.update);
        gameRoom.state.listen(Communication.listen);
    }
    static SendMessage(message) {
        console.log('Send', message);
        Communication.client.send(message);
    }
    static update(state) {
        console.log(state);
    }
    static listen(number, message) {
        console.log('listen', number, message);
    }
    static onJoin(client, room) {
        console.log(client, "joined", room);
    }
}
/*

   
*/ 
//# sourceMappingURL=communication.js.map