class GenericUnit {
    public modelName: string;
    public health: number;
    private scale: number;
    private position: THREE.Vector3;
    private rotation: THREE.Vector3;
 
    public mesh: THREE.Mesh;
    private animations: THREE.AnimationClip[];
    private materials: any;
    public isLoaded: boolean;
    constructor(modelName: string, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        this.modelName = modelName;
        this.health = health;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.isLoaded = false;
    }

    public loadModel(scene: THREE.Scene, geometry: THREE.Geometry, materials: any) {
            var material = materials[0];
            material.morphTargets = true;

            //This is hardcoded for now
            material.color.setHex(0xffaaaa);
            
            this.animations = geometry.animations;

            var faceMaterial = new THREE.MultiMaterial(materials);
            this.mesh = new THREE.Mesh(geometry, faceMaterial);
            this.mesh.scale.set(this.scale, this.scale, this.scale);
            
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);

            scene.add(this.mesh);

            //TO DO 
            //Decide how should these animatins look and move Main.getInstance() from here
            Main.getInstance().getRenderer().animationMixer.clipAction(this.animations[0], this.mesh)
                .setDuration(this.animations[0].duration)			// one second
                .startAt(- Math.random())	// random phase (already running)
               .play();
            this.isLoaded = true;
    }

    public setPosition(position: THREE.Vector3) {
        this.position = position;
        this.mesh.updateMatrix();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    public getPosition() {
        return this.position;
    }
    public setRotation(rotation: THREE.Vector3) {
        this.rotation = rotation;
        this.mesh.updateMatrix();
        this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    }

    public moveOnX(x) {
        this.mesh.translateX(x - this.getPosition().x);
        this.position = this.mesh.position;
    }
    public moveOnY(y) {
        this.mesh.translateY(y - this.getPosition().y);
        this.position = this.mesh.position;
    }
    public moveOnZ(z) {
        this.mesh.translateZ(z - this.getPosition().z);
        this.position = this.mesh.position;
    }

    public playAnimation() {
        Main.getInstance().getRenderer().animationMixer.clipAction(this.animations[0], this.mesh)
            .setDuration(this.animations[0].duration)			// one second
            .startAt(- Math.random())	// random phase (already running)
            .play();		
    }
}