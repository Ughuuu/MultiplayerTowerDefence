/// <reference path="../../../node_modules/@types/three/index.d.ts" />

class Render {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: any;
    clock: THREE.Clock;
    animationMixer: THREE.AnimationMixer;
    planes: THREE.Geometry[][];
    width: number;
    height: number;
    cellWidth: number;
    cellHeight: number;
    mouse: THREE.Vector2;
    initialX: number;
    initialY: number;
    light1: THREE.Light;
    light2: THREE.Light;
    currentPlane: THREE.Mesh;

    constructor() {
        this.planes = [];

    }
    createScene(width, height, container) {
        this.width = 800;
        this.height = 600;
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
        this.camera.rotation.x = 120 * Math.PI / 180;
        this.scene.add(this.camera);
    }
    createLight() {
        let light1 = new THREE.PointLight(0xFFFFFF, 2);
        let light2 = new THREE.DirectionalLight(0xFFFFFF, 1);
        light2.position.set(.2, -1, -.2);
        var ambient = new THREE.AmbientLight(0x404040, 0.3); // soft white light
        // add to the scene
        this.scene.add(light1);
        this.scene.add(light2);
        this.scene.add(ambient);
        this.light1 = light1;
    }

    moveLights() {
        this.light1.position.set(this.camera.position.x, this.height / 2, 200);
    }

    public initMap(initialX: number, initialY: number, matrix: number[][], width: number, height: number, cellWidth: number, cellHeight: number) {

        this.initialX = initialX;
        this.initialY = initialY;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        for (let i: number = 0; i < height; i++) {
            this.planes[i] = [];
            for (let j: number = 0; j < width; j++) {

                this.planes[i][j] = new THREE.PlaneGeometry(cellWidth, cellHeight, width, height);
                let plane: any;

                plane = Main.getInstance().geometryMap['assets/tiles/cell.json'][1].clone();
                // plane.material.color = new THREE.Color(0, 160, 0);
                plane.name = "cell[" + i + "][" + j + "]";
                plane.position.x = (j + 0.5) * cellWidth + this.initialX;
                plane.position.y = (i + 0.5) * cellHeight - this.initialY;
                plane.position.z = 0;
                plane.rotation.x = Math.PI / 2;
                plane.rotation.y = Math.floor((Math.random() * 4)) * Math.PI;
                plane.scale.set(1.27, 1.27, 1.27);
                this.scene.add(plane);
            }
        }
    }

    public drawSelectRectangle(x: number, y: number) {
        this.scene.remove(this.currentPlane);
        let material = new THREE.MeshLambertMaterial({ color: 0xffff00 });
        material.opacity = 0.7;
        material.transparent = true;
        let planeGeometry = new THREE.PlaneGeometry(this.cellWidth, this.cellHeight, 1, 1);
        this.currentPlane = new THREE.Mesh(planeGeometry, material);
        this.currentPlane.position.x = x;
        this.currentPlane.position.y = y;
        this.currentPlane.position.z = 5;
        this.scene.add(this.currentPlane);
    }
    public convertGameCoorToMapCoord(position: THREE.Vector3) {
        let x = (position.x - this.initialX) / this.cellWidth;
        let y = (position.y + this.initialY) / this.cellWidth;
        return { x: x, y: y };

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

    public update() {
        // update the picking ray with the camera and mouse position
        this.renderer.render(this.scene, this.camera);
        var delta = this.clock.getDelta();
        if (this.animationMixer != null)
            this.animationMixer.update(delta);
    }
}