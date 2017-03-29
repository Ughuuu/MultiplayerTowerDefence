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
        this.gameRoom.onData.add(this.onData);
        // remove on a map, a player left
        this.gameRoom.state.listen("directions/:id/:y/:x:", "replace", (id, x, y, value) => {
            if (id != this.client.id)
                return;
            Main.getInstance().updateArrows(x, y, value);
        });

        // remove on a map, a player left
        this.gameRoom.state.listen("directions/:id", "add", (id, value) => {
            if (id != this.client.id)
                return;
            for (let i: number = 0; i < value.length; i++) {
                for (let j: number = 0; j < value[0].length; j++) {
                    Main.getInstance().updateArrows(i, j, value[i][j]);
                }
            }

        });

        // add on a whole map
        this.gameRoom.state.listen("template", "add", (map) => {
            Main.getInstance().setMap(map);
        });

        // change on a map
        this.gameRoom.state.listen("template/:y/:x", "replace", (id, y, x, value) => {
            let mesh: any = Main.getInstance().getRenderer().scene.getObjectByName("cell[" + y + "][" + x + "]");
            mesh.material.color = new THREE.Color(value * 50);
        });
        // change on a map
        this.gameRoom.state.listen("players/:id/life", "replace", (id, value) => {
            Main.getInstance().setLife(id, value);
        });
        this.gameRoom.state.listen(this.listen);
    }

    getXYA(xya: number) {
        let x = Math.round(xya % this.precision1) / this.decimals;
        let y = Math.round((xya / this.precision1) % this.precision1) / this.decimals;
        let a = Math.round((xya / this.precision2) % this.precision1) / this.decimals;
        x = x * 20;
        y = y * 20;
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
            if (obj == null || !obj.isLoaded) {
                return;
            }
            obj.setRotationY(x, y);
            obj.moveOnX(x);
            obj.moveOnY(y);
            obj.mesh.updateMatrix();
        });
        this.gameRoom.state.listen("bodies/:id", "remove", (id, value) => {
            Main.getInstance().removeUnit(id);
        });
        this.gameRoom.state.listen("bodies/:id", "add", (id, value) => {
            if (value == null) {
                return;
            }
            let com = Main.getInstance().getCommunication();
            let xya = this.getXYA(value.xya);
            let x = xya.x;
            let y = xya.y;
            if (value.classType == 0) {
                Main.getInstance().addTower(id, value.type, 100, new THREE.Vector3(x, y, -300), new THREE.Vector3(Math.PI / 2, 0, 0), 5 * com.towerTypes[value.type].radius);
            }
            if (value.classType == 1) {
                Main.getInstance().addCreep(id, value.type, 100, new THREE.Vector3(x, y, -300), new THREE.Vector3(Math.PI / 2, 0, 0), 10 * com.unitTypes[value.type].radius);
            }
            if (value.classType == 2) {
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
        for (let i = 0; i < 1; i++)
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
        const container = document.querySelector('#name');
        container.innerHTML = "Id:" + com.client.id;

        com.modelCount += state.unit_types.length;
        com.modelCount += state.tower_types.length;
        com.unitTypes = state.unit_types;
        com.towerTypes = state.tower_types;
        Main.getInstance().setUnitTypes(state.unit_types, com.progress);
        Main.getInstance().setTowerTypes(state.tower_types, com.progress);
    }
    onData(data) {
        Main.getInstance().onData(data);
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
    }

    listen(number, message, value) {
        //console.log(number, message, value);
    }

    onJoin(client, room) {
    }
}