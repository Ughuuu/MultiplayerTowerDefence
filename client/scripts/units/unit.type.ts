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
        public elementType: ElementType,
        public speed: number) { }
};
class ProjectileType {
    constructor(public name: string,
        public model: string) { }
};

enum ElementType {
    Stone = 0,
    Iron,
    Fire,
    Ice,
}

enum WalkType {
    Ground = 0,
    Flying
};

