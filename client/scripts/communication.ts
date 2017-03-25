/// <reference path="./units/generic.unit.ts" />


class Communication {
    client: any;
    state: any;
    unitTypes: UnitType[];
    towerTypes: TowerType[];
    modelCount: number = 0;
    gameRoom;
    precision1: number = Math.pow(10, 6);
    precision2: number = Math.pow(10, 12);
    decimals: number = Math.pow(10, 3);

    constructor(client) {
        this.state = null;
        this.client = client;
    }

    joinRoom(room) {
        this.gameRoom = this.client.join(room);
        this.gameRoom.onJoin.add(this.onJoin);

        this.gameRoom.onUpdate.addOnce(this.init);
        this.gameRoom.state.listen(this.listen);
    }

    getXYA(xya: number) {
        console.log(xya);
        let x = Math.round(xya % this.precision1) / this.decimals;
        let y = Math.round((xya / this.precision1) % this.precision1) / this.decimals;
        let a = Math.round((xya / this.precision2) % this.precision1) / this.decimals;
        x *= 10;
        y *= 10;
        y-=100;
        return { x: x, y: y, a: a };
    }

    addCallbacks() {
        this.gameRoom.state.listen("bodies/:id/:attribute", "replace", (id, xy, value) => {
            if (xy != 'xya') {
                return;
            }
            let xya = this.getXYA(value);
            let x = xya.x;
            let y = xya.y;
            let obj = Main.getInstance().getUnit(id);
            if (!obj.isLoaded) {
                return;
            }
            obj.setRotationY(x, y);
            obj.moveOnX(x);
            obj.moveOnY(y);
            obj.mesh.updateMatrix();
        });
        this.gameRoom.state.listen("bodies/:id", "add", (id, value) => {
            let com = Main.getInstance().getCommunication();
            let xya = this.getXYA(value.xya);
            let x = xya.x;
            let y = xya.y;
            if (value.isTower) {
                Main.getInstance().addTower(id, value.type, 100, new THREE.Vector3(x, y, -300), new THREE.Vector3(Math.PI / 2, 0, 0), 5 * com.towerTypes[value.type].radius);
            }
            else {
                Main.getInstance().addCreep(id, value.type, 100, new THREE.Vector3(x, y, -300), new THREE.Vector3(Math.PI / 2, 0, 0), 10 * com.unitTypes[value.type].radius);
            }
            let obj = Main.getInstance().getUnit(id);
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
        for(let i=0;i<10;i++)
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
        //Main.getInstance().getUnit(0).state = false;

    }

    init(state) {
        let com = Main.getInstance().getCommunication();
        com.modelCount += state.unit_types.length;
        com.modelCount += state.tower_types.length;
        com.unitTypes = state.unit_types;
        com.towerTypes = state.tower_types;
        Main.getInstance().setUnitTypes(state.unit_types, com.progress);
        Main.getInstance().setTowerTypes(state.tower_types, com.progress);
    }

    progress() {
        let com = Main.getInstance().getCommunication();
        com.modelCount--;
        if (com.modelCount == 0) {
            com.doAfterModelLoad();
        }
    }

    doAfterModelLoad() {
        let com = Main.getInstance().getCommunication();
        com.addCallbacks();
        com.setTowerTest();
    }

    setTowerTest() {
        let com = Main.getInstance().getCommunication();
        com.createTower(0, 0, 3);
        com.createTower(0, 1, 3);
        com.createTower(0, 2, 3);
        com.createTower(0, 3, 3);
        com.createTower(0, 4, 3);
        com.createTower(0, 5, 3);

        com.createTower(0, 7, 6);
        com.createTower(0, 6, 6);
        com.createTower(0, 5, 6);
        com.createTower(0, 4, 6);
        com.createTower(0, 3, 6);

        com.createTower(0, 0, 9);
        com.createTower(0, 1, 9);
        com.createTower(0, 2, 9);
        com.createTower(0, 3, 9);
        com.createTower(0, 4, 9);
        com.createTower(0, 5, 9);
    }

    listen(number, message, value) {
    }

    onJoin(client, room) {
    }
}