/// <reference path="./units/generic.unit.ts" />
enum ElementType {
    Normal = 0,
    Fire,
    Water,
    Light,
    Dark,
    Nature,
    Earth
};

class TowerType {
    constructor(public name: string,
        public texture: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType.Normal,
        public speed: number) { }
};

enum WalkType {
    Ground = 0,
    Flying
};

class UnitType {
    constructor(public name: string,
        public texture: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType,
        public speed: number,
        public armor: number,
        public walkType: WalkType,
        public mass: number) { }
};

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
            let obj = Main.getInstance().getUnit(id).mesh; //Main.getInstance().getRenderer().scene.getObjectByName(id);
            switch (xy)
                {
                case 'x':
                    obj.updateMatrix();
                    obj.position.x = value;
                    break;
                case 'y':
                    obj.updateMatrix();
                    obj.position.y = value;
                    break;
                default:
                    obj.updateMatrix();
                    obj.rotation.y = value;
            } 
        });
        gameRoom.state.listen("bodies/:id", "add", (id, value) => {
            //console.log(id);
            //console.log(value); 
            //Main.getInstance().createSphere(1, id, value.x, value.y);
            Main.getInstance().addUnit(id, "img/monster.json", 100, new THREE.Vector3(value.x, value.y, -300), new THREE.Vector3(0, 0, 0), 0.025, );
            //this.generic = new GenericUnit(id, "img/monster.json",100, new THREE.Vector3(value.x, value.y, -300), new THREE.Vector3(0, 0, 0), 0.025, );//Main.getInstance().getRenderer().create3DModel(id, new THREE.Vector3(value.x, value.y, -300), new THREE.Vector3(0, 0, 0), 0.025, "img/monster.json");
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

        for (let i = 0; i < 1; i++) {
            this.createUnit(0);
        }
    }

    init(state) {
        this.unitTypes = state.unit_types;
        this.towerTypes = state.tower_types;
    }

    listen(number, message, value) {
    }

    onJoin(client, room) {
    }
}