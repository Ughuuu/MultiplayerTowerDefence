
/// <reference path="./render/render.ts" />
/// <reference path="./communication.ts" />

class Main {
    private static instance: Main;

    private communication: Communication;
    private renderer: Render;
    static getInstance() {
        if (!Main.instance) {
            Main.instance = new Main();
        }
        return Main.instance;
    }

    public CreateCommunication(client) {
        this.communication = new Communication(client);
    }

    public GetCommunication() {
        return this.communication;
    }

    public GetRenderer() {
        return this.renderer;
    }

    public CreateScene() {
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const container = document.querySelector('#container');
        this.renderer = new Render();

        this.renderer.CreateScene(WIDTH, HEIGHT, container);

    }

    public CreateCamera() {
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const VIEW_ANGLE = 45;
        const ASPECT = WIDTH / HEIGHT;
        const NEAR = 0.1;
        const FAR = 10000;
        this.renderer.CreateCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    }

    public CreateLight() {
        this.renderer.CreateLight(0xFFFFFF, 10, 20, 30);
    }

    public CreateSphere(radius: number, id: any, x: number, y: number) {
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
        this.renderer.scene.add(sphere);
        sphere.position.x = x;
        sphere.position.y = y;
        sphere.position.z = -300;
        sphere.name = id;

    }
    public update(){
        this.renderer.update();
    }
    
    constructor() {

    }

}