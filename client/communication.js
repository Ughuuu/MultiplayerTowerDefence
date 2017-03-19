class Communication {
    constructor(client) {
        this.client = client;
        console.log(client);
        var chatRoom = client.join("game");
        chatRoom.onUpdate.addOnce(this.update);
        chatRoom.state.listen(this.listen);
        function addMessage(message) {
            var node = document.createElement("p");
            node.innerHTML = message;
            document.getElementById('messages').appendChild(node);
        }
    }
    SendMessage(message) {
        this.client.send(message);
    }
    update() {
        console.log('update');
    }
    listen() {
        this.SendMessage('pSlm');
        console.log('listen');
    }
}
/*

   
*/ 
//# sourceMappingURL=communication.js.map