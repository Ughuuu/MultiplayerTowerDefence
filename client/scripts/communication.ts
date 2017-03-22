/// <reference path="./units/generic.unit.ts" />


class Communication {
    client: any;
    state: any;
    unitTypes: UnitType[];
    towerTypes: TowerType[];
    constructor(client) {
        this.state = null;
        this.client = client;
    }

    joinRoom(room) {
        var gameRoom = this.client.join(room);
        gameRoom.onJoin.add(this.onJoin);

        gameRoom.onUpdate.addOnce(this.init);
        gameRoom.state.listen(this.listen);
        gameRoom.state.listen("bodies/:id/:attribute", "replace", (id, xy, value) => {
            let obj = Main.getInstance().getUnit(id);
            if (obj != null && obj.isLoaded) {
                switch (xy) {
                    case 'x':
                        obj.moveOnX(value);
                        break;
                    case 'y':
                        obj.moveOnY(value);
                        break;
                    default:
                        obj.mesh.updateMatrix();
                    //  obj.mesh.rotation.x = value;
                }
        }
        });
        gameRoom.state.listen("bodies/:id", "add", (id, value) => {
            Main.getInstance().addUnit(id, "img/monster.json", 100, new THREE.Vector3(value.x, value.y, -300), new THREE.Vector3(0, 0, 0), 0.025);
 
        });
    }

    createTower(type: number, x: number, y: number) {
        this.client.send({
            PhysicsHandler:
            {
                createTower:
                {
                    type: type,
                    position:
                    {
                        x: x,
                        y: y
                    }
                }
            }
        }
        );
    }

    createUnit(type) {
        this.client.send({
            PhysicsHandler:
            {
                createUnit:
                {
                    type: type
                }
            }
        }
        );
    }

    sendMessage(message) {
        this.client.send(message);
     
        for (let i = 0; i < 100; i++) {
            this.createUnit(0);
        }

    }

    init(state) {
        Main.getInstance().setUnitTypes(state.unit_types);
        Main.getInstance().setTowerTypes(state.tower_types);
    }

    listen(number, message, value) {
    }

    onJoin(client, room) {
    }
}