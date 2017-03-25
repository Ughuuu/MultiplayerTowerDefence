/// <reference path="../../../node_modules/@types/three/index.d.ts" />

class Render {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    light: THREE.PointLight;
    camera: any;
    clock: THREE.Clock;
    animationMixer: THREE.AnimationMixer;
    constructor() {

    }
    createScene(width, height, container) {
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.renderer.setSize(width, height);
        this.animationMixer = new THREE.AnimationMixer(this.scene);
        this.clock = new THREE.Clock();
        container.appendChild(this.renderer.domElement);
    }
    createCamera(viewAngle, aspect, near, far) {
        this.camera =
            new THREE.PerspectiveCamera(
                viewAngle,
                aspect,
                near,
                far
            );
        this.camera.position.set(0, 0, 100);
        this.scene.add(this.camera);
    }
    createLight(value, x, y, z) {
        this.light =
            new THREE.PointLight(0xFFFFFF);

        // set its position
        this.light.position.x = 10;
        this.light.position.y = 50;
        this.light.position.z = 130;

        // add to the scene
        this.scene.add(this.light);
        var texture = new THREE.TextureLoader().load("/img/map.jpg");
        var material = new THREE.MeshLambertMaterial({ map: texture });
        var geometry = new THREE.PlaneGeometry(1000, 1000, 200, 200);

        let plane = new THREE.Mesh(geometry, material);
        plane.position.z = -400;
        this.scene.add(plane);
    }

    public loadJson(modelPath: string) {

    }
    public createSphere(radius: number, id: any, x: number, y: number) {
        const sphereMaterial =
            new THREE.MeshLambertMaterial(
                {
                    color: 0xCC0000
                });
        // Set up the sphere vars
        const segments = 16;
        const rings = 16;
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(
                radius,
                segments,
                rings),
            sphereMaterial);
        this.scene.add(sphere);
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = -300;
        sphere.name = id;
    }
    update() {
        this.renderer.render(this.scene, this.camera);
        var delta = this.clock.getDelta();
        if (this.animationMixer != null)
            this.animationMixer.update(delta);
    }
}