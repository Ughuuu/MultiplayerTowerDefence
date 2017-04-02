class Creep extends GenericUnit {
    type: UnitType;
    constructor(id: number, unitType: UnitType, modelName: string, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number, scene: THREE.Scene, mesh: THREE.Mesh) {
        super(modelName, health, position, rotation, scale, scene, mesh);
        this.type = unitType;
        this.mesh.name = "creep:"+id;
    }
}