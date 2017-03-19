enum ElementType {
    Normal = 0,
    Fire,
    Water,
    Light,
    Dark,
    Nature,
    Earth
}

class TowerType {
    constructor(public name: string,
        public texture: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType.Normal,
        public speed: number) { }
}

enum WalkType {
    Ground = 0,
    Flying
}

class UnitType {
    constructor(public name: string,
        public texture: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType,
        public speed: number,
        public armor: number,
        public walkType: WalkType) { }
}

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
            console.log(`body ${id} changed attribute ${xy} to ${value}`);
        });
        gameRoom.state.listen("bodies/:id", "add", (id, value) => {
            console.log(value);
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
    }

    init(state) {
        this.unitTypes = state.unit_types;
        this.towerTypes = state.tower_types;
    }

    listen(number, message) {
    }

    onJoin(client, room) {
    }
}