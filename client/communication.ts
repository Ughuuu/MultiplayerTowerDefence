class Communication {
    static client: any;
    static unitTypes:
    static state: any;
    constructor(client) {

    }
    static CreateComunication(client) {
        Communication.state = null;
        Communication.client = client;
    }
    static joinRoom(room) {
        var gameRoom = Communication.client.join("game");
        gameRoom.onJoin.add(Communication.onJoin);
        gameRoom.onUpdate.addOnce(Communication.update);
        gameRoom.state.listen(Communication.listen);
        gameRoom.state.listen("bodies/:id/:attribute", "replace", (id, xy, value) => {
            //console.log(`body ${id} changed attribute ${xy} to ${value}`);
        });
        gameRoom.state.listen("bodies/:id", "add", (id, value) => {
            console.log(value);
        });
    }
    static SendMessage(message) {
        Communication.client.send(message);
        Communication.client.send({
            PhysicsHandler:
            {
                createTower:
                {
                    type: 0,
                    position:
                    {
                        x: 0,
                        y: 0
                    }
                }
            }
        }
        );
        Communication.client.send({
            PhysicsHandler:
            {
                createUnit:
                {
                    type: 0
                }
            }
        }
        );
    }
    static update(state) {
        state.unit_types;
    }
    static listen(number, message, value) {
        //console.log('listen', number, message, value);
    }
    static onJoin(client, room) {
        //console.log(client, "joined", room);
    }
}