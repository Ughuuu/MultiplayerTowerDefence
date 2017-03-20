﻿enum ElementType {
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
            let obj = Main.getInstance().GetRenderer().scene.getObjectByName(id);
            if (xy == 'x') {
                obj.position.x = value;
            }
            else if (xy == 'y') {
                obj.position.y = value;
            }
        });
        gameRoom.state.listen("bodies/:id", "add", (id, value) => {
            //console.log(id);
            //console.log(value);
            Main.getInstance().CreateSphere(1, id, value.x, value.y);
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

        for (let i = 0; i < 10; i++) {
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