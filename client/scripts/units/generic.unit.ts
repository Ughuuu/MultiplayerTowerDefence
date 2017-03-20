class GenericUnit {
    public modelName: string;
    public health: number;
    private scale: number;
    private position: THREE.Vector3;
    private rotation: THREE.Vector3;
    private geometry: THREE.Geometry;
    public mesh: THREE.Mesh;
    private animations: THREE.AnimationClip[];
    private materials: any;
    constructor(modelName: string, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        this.modelName = modelName;
        this.health = health;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        var loader = new THREE.JSONLoader();
        loader.load(modelName, function (geometry: THREE.Geometry, materials: any) {
            var material = materials[0];
            material.morphTargets = true;
            material.color.setHex(0xffaaaa);

            this.animations = geometry.animations;

            var faceMaterial = new THREE.MultiMaterial(materials);
            this.mesh = new THREE.Mesh(geometry, faceMaterial);
            this.mesh.scale.set(scale, scale, scale);
  
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

            this.mesh.matrixAutoUpdate = false;
            this.mesh.updateMatrix();
            Main.getInstance().getRenderer().scene.add(this.mesh);
            Main.getInstance().getRenderer().animationMixer.clipAction(this.animations[0], this.mesh)
                .setDuration(this.animations[0].duration)			// one second
                .startAt(- Math.random())	// random phase (already running)
                .play();		
        }.bind(this));
    }

    public setPosition(position: THREE.Vector3) {
        this.mesh.updateMatrix();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    public setRotation(rotation: THREE.Vector3) {
        this.rotation = rotation;
    }

    public playAnimation() {
        Main.getInstance().getRenderer().animationMixer.clipAction(this.animations[0], this.mesh)
            .setDuration(this.animations[0].duration)			// one second
            .startAt(- Math.random())	// random phase (already running)
            .play();		
    }
}