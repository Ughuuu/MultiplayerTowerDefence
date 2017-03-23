class UnitType {
    constructor(public name: string,
        public model: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType,
        public speed: number,
        public armor: number,
        public walkType: WalkType,
        public mass: number) { }
};

class TowerType {
    constructor(public name: string,
        public model: string,
        public radius: number,
        public health: number,
        public damage: number,
        public elementType: ElementType.Normal,
        public speed: number) { }
};
enum ElementType {
    Normal = 0,
    Fire,
    Water,
    Light,
    Dark,
    Nature,
    Earth
};



enum WalkType {
    Ground = 0,
    Flying
};

