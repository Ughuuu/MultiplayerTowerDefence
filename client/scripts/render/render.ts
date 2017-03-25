/// <reference path="../../../node_modules/@types/three/index.d.ts" />

class Render {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    light: THREE.PointLight;
    camera: any;
    clock: THREE.Clock;
    animationMixer: THREE.AnimationMixer;
    planes: THREE.Geometry[][];
    width: number;
    height: number;
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
       
    }

    public initMap(matrix: number[][], width: number, height: number) {
        var textureGrass = new THREE.TextureLoader().load("/assets/tiles/grass.png");
        var textureRock = new THREE.TextureLoader().load("/assets/tiles/rock.jpg");
        var textureSwamp = new THREE.TextureLoader().load("/assets/tiles/swamp.jpg");
        var materialGrass = new THREE.MeshLambertMaterial({ map: textureGrass });
        var materialRock = new THREE.MeshBasicMaterial({ map: textureRock, side: THREE.DoubleSide });
        var materialSwamp = new THREE.MeshBasicMaterial({ map: textureSwamp, side: THREE.DoubleSide });

        let initialX: number = 12;
        let initialY: number = this.height/2-60;
        let cellWidth: number = 20;
        let cellHeight: number = 20;
        var materials = [materialGrass, materialRock, materialSwamp];
     
        for (let i: number = 0; i < height; i++) {
            this.planes[i] = [];
            for (let j: number = 0; j < width; j++) {
                this.planes[i][j] = new THREE.PlaneGeometry(cellWidth, cellHeight, width, height);
                if (matrix[i][j] == 0) {
                    let plane = new THREE.Mesh(this.planes[i][j], materialGrass);
                    plane.position.x = j * cellWidth + initialX;
                    plane.position.y = i * cellHeight - initialY;
                    plane.position.z = -400;
                    console.log(plane.position);
                    this.scene.add(plane);
                }
                if (matrix[i][j] == 30) {

                    let plane = new THREE.Mesh(this.planes[i][j], materialSwamp);
                    plane.position.x = j * cellWidth + initialX;
                    plane.position.y = i * cellHeight - initialY;//- this.height / 2;
                    plane.position.z = -400;
                    console.log(plane.position);
                    this.scene.add(plane);
                }
            }
        }

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