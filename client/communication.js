var Communication = (function () {
    function Communication(client) {
    }
    Communication.CreateComunication = function (client) {
        Communication.state = null;
        Communication.client = client;
        console.log(client);
    };
    Communication.joinRoom = function (room) {
        var gameRoom = Communication.client.join("game");
        gameRoom.onJoin.add(Communication.onJoin);
        gameRoom.onUpdate.add(Communication.update);
        gameRoom.state.listen(Communication.listen);
    };
    Communication.SendMessage = function (message) {
        console.log('Send', message);
        Communication.client.send(message);
    };
    Communication.update = function (state) {
        console.log(state);
    };
    Communication.listen = function (number, message) {
        console.log('listen', number, message);
    };
    Communication.onJoin = function (client, room) {
        console.log(client, "joined", room);
    };
    return Communication;
}());
/*

   
*/ 
