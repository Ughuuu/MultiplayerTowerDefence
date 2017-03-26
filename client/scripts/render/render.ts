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
    cellWidth: number;
    cellHeight: number;
    mouse: THREE.Vector2;
    initialX: number;
    initialY: number;
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
        this.camera.position.set(0, 200, 300);
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

    public initMap(matrix: number[][], width: number, height: number, cellWidth: number, cellHeight :number) {
        let textureGrass = new THREE.TextureLoader().load("/assets/tiles/grass.png");
        let textureRock = new THREE.TextureLoader().load("/assets/tiles/rock.jpg");
        let textureSwamp = new THREE.TextureLoader().load("/assets/tiles/swamp.jpg");
       

        this.initialX = 0;
        this.initialY = 0;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
     

        for (let i: number = 0; i < height; i++) {
            this.planes[i] = [];
            for (let j: number = 0; j < width; j++) {
                let materialGrass = new THREE.MeshLambertMaterial({ map: textureGrass });
                let materialRock = new THREE.MeshLambertMaterial({ map: textureRock, side: THREE.DoubleSide });
                let materialSwamp = new THREE.MeshLambertMaterial({ map: textureSwamp, side: THREE.DoubleSide });

                this.planes[i][j] = new THREE.PlaneGeometry(cellWidth, cellHeight, width, height);
                let plane;
                if (matrix[i][j] == 0) {
                    plane = new THREE.Mesh(this.planes[i][j], materialGrass);
                }
                if (matrix[i][j] == 30) {
                    plane = new THREE.Mesh(this.planes[i][j], materialSwamp);
                }
                plane.name = "cell";
                plane.position.x = (j+0.5) * cellWidth + this.initialX;
                plane.position.y = (i+0.5) * cellHeight - this.initialY;
                plane.position.z = -300;
                this.scene.add(plane);
            }
        }

    }

    public convertGameCoorToMapCoord(position: THREE.Vector3) {
        let x = (position.x - this.initialX)/ this.cellWidth
        let y = (position.y + this.initialY) / this.cellWidth
        console.log(x + ' ' + y);
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