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

    public initMap(matrix: number[][], width: number, height: number, cellWidth: number, cellHeight: number) {
        let textureGrass = new THREE.TextureLoader().load("/assets/tiles/grass.png");
        let textureRock = new THREE.TextureLoader().load("/assets/tiles/rock.jpg");
        let textureSwamp = new THREE.TextureLoader().load("/assets/tiles/swamp.jpg");

        let textureArrow = new THREE.TextureLoader().load("/assets/arrow.png");


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

                let materialArrow = new THREE.MeshLambertMaterial({ map: textureArrow, side: THREE.DoubleSide });

                this.planes[i][j] = new THREE.PlaneGeometry(cellWidth, cellHeight, width, height);
                let plane: any;
                let arrowMesh: THREE.Mesh;

                plane = new THREE.Mesh(this.planes[i][j], materialGrass);
               // plane.material.color = new THREE.Color(0, 160, 0);
                plane.name = "cell[" + i + "][" + j + "]";
                plane.position.x = (j + 0.5) * cellWidth + this.initialX;
                plane.position.y = (i + 0.5) * cellHeight - this.initialY;
                plane.position.z = -300;
                this.scene.add(plane);

                arrowMesh = new THREE.Mesh(this.planes[i][j], materialArrow);
                arrowMesh.position.x = (j + 0.5) * cellWidth + this.initialX;
                arrowMesh.position.y = (i + 0.5) * cellHeight - this.initialY;
                arrowMesh.position.z = -300;
                arrowMesh.name = "arrowMesh[" + i + "][" + j + "]";
                arrowMesh.rotation.set(0, 0, Math.PI - Math.PI / 4);
                arrowMesh.rotation.set(0, 0, Math.PI / 2);
                arrowMesh.material.transparent = true;
               // arrowMesh.material.color = new THREE.Color(0, 0, 0);
                arrowMesh.material.opacity = 0.3;
                this.scene.add(arrowMesh);
            }
        }

    }

    public updateArrows(x: number, y: number, value: number) {
        let object = this.scene.getObjectByName("arrowMesh[" + x + "][" + y + "]");
        switch (value) {
            case 0:
                object.rotation.set(0, 0, Math.PI);
                break;
            case 1:
                object.rotation.set(0, 0, Math.PI - Math.PI / 4);
                break;
            case 2:
                object.rotation.set(0, 0, Math.PI/2);
                break;
            case 3:
                object.rotation.set(0, 0, Math.PI / 4);
                break;
            case 4:
                object.rotation.set(0, 0, 2 * Math.PI);
                break;
            case 5:
                object.rotation.set(0, 0, 2 * Math.PI - Math.PI/4);
                break;
            case 6:
                object.rotation.set(0, 0, 3 * Math.PI / 2);
                break;
            case 7:
                object.rotation.set(0, 0, 3 * Math.PI / 2 - Math.PI / 4);
                break;
        }
       
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