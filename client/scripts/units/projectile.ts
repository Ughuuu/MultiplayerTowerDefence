class Projectile extends GenericUnit {
    type: ProjectileType;
    constructor(id: number, unitType: ProjectileType, modelName: string, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number, scene: THREE.Scene, mesh: THREE.Mesh) {
        super(modelName, health, position, rotation, scale, scene, mesh);
        this.type = unitType;
        this.mesh.name = "projectile:" + id;
    }
}