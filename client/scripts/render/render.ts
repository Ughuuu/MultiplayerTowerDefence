/// <reference path="../../../node_modules/@types/three/index.d.ts" />

class Render {
    scene: any;
    renderer: any;
    light: any;
    camera: any;
    clock: THREE.Clock;
    animationMixer: THREE.AnimationMixer;
    constructor() {

    }
    createScene(width, height, container){
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.renderer.setSize(width, height);
        this.animationMixer = new THREE.AnimationMixer(this.scene);
        this.clock = new THREE.Clock();
        container.appendChild(this.renderer.domElement);
    }
    createCamera(viewAngle,aspect,near,far) { 
         this.camera =
            new THREE.PerspectiveCamera(
                viewAngle,
                aspect,
                near,
                far
            );
        this.scene.add(this.camera);
    }
    createLight(value,x,y,z) {
        const pointLight =
            new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        this.scene.add(pointLight);
    }
    public create3DModel(id: any, position: THREE.Vector3, rotation: THREE.Vector3, scale: number, file: string) {
        var loader = new THREE.JSONLoader();
        loader.load(file, function (geometry, materials) {
            var material = materials[0];
            material.morphTargets = true;
            material.color.setHex(0xffaaaa);

            var faceMaterial = new THREE.MultiMaterial(materials);
            var mesh = new THREE.Mesh(geometry, faceMaterial);
                mesh.scale.set(scale, scale, scale);

                mesh.position.set(position.x, position.y, position.z);
                mesh.rotation.set(rotation.x, rotation.y, rotation.z);

                mesh.matrixAutoUpdate = false;
                mesh.updateMatrix();
                mesh.name = id;
                this.scene.add(mesh);
                this.animationMixer.clipAction(geometry.animations[0], mesh)
                    .setDuration(1)			// one second
                    .startAt(- Math.random())	// random phase (already running)
                    .play();					// let's go
        }.bind(this));

    }
    update() {
        this.renderer.render(this.scene, this.camera);
        var delta = this.clock.getDelta();
        if (this.animationMixer!=null)
        this.animationMixer.update(delta);
        requestAnimationFrame(function() {this.update() }.bind(this));
    }

    // Schedule the first frame.
   // requestAnimationFrame(function() { this.update() }.bind(this));
}
/*

   
*/