class GenericUnit {
    public modelName: string;
    public health: number;
    private scale: number;
    private position: THREE.Vector3;
    private rotation: THREE.Vector3;

    public mesh: THREE.Mesh;
    private animations: THREE.AnimationClip[];
    private materials: any;
    private animationMixer: THREE.AnimationMixer;
    public isLoaded: boolean;
    
    constructor(modelName: string, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number, public type) {
        this.modelName = modelName;
        this.health = health;
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
        this.isLoaded = false;
    }

    public loadModel(scene: THREE.Scene, geometry: THREE.Geometry, mesh: THREE.Mesh) {
        this.animations = geometry.animations;
        this.mesh = mesh.clone();
        this.mesh.scale.set(this.scale, this.scale, this.scale);

        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
        this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        this.animationMixer = new THREE.AnimationMixer(this.mesh);

        this.isLoaded = true;
        this.playMoveAnimation();

        scene.add(this.mesh);


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
        this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    }

    public setRotationY(x: number, y: number, rate: number) {
        let ang: number = Math.atan2(this.position.y - y, this.position.x - x);
        let newRot = ang - Math.PI / 2;
        let deltaRot = -rate;
        if(this.rotation.y - newRot < 0){
            deltaRot = rate;
        }
        this.rotation.y = this.rotation.y + deltaRot;
        this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    }

    public setRotationYFix(x: number, y: number) {
        let ang: number = Math.atan2(this.position.y - y, this.position.x - x);
        let newRot = ang - Math.PI / 2;
        this.rotation.y = newRot;
        this.mesh.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    }

    public moveOnX(x) {
        this.mesh.position.x = x;
        this.position = this.mesh.position;
    }
    public moveOnY(y) {
        this.mesh.position.y = y;
        this.position = this.mesh.position;
    }
    public moveOnZ(z) {
        this.mesh.position.z = z;
        this.position = this.mesh.position;
    }

    public playMoveAnimation() {
        //TO DO 
        //Decide how should these animatins look and move Main.getInstance() from here
        if (this.animations != null) {
            this.animationMixer.clipAction(this.animations[0], this.mesh)
                .setDuration(this.animations[0].duration)			// one second
                .startAt(- Math.random())	// random phase (already running)
                .play()
        }
    }

    //Units handle their animations
    public update(delta: number) {
        if (this.animationMixer != null) {
            this.animationMixer.update(delta);
        }
    }
}