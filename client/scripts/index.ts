
/// <reference path="./render/render.ts" />
/// <reference path="./communication.ts" />
/// <reference path="./units/generic.unit.ts" />
class Main {
    private static instance: Main;

    private communication: Communication;
    private renderer: Render;
    private unitsMap = {};
    static getInstance() {
        if (!Main.instance) {
            Main.instance = new Main();
        }
        return Main.instance;
    }

    public createCommunication(client) {
        this.communication = new Communication(client);
    }

    public getCommunication() {
        return this.communication;
    }

    public getRenderer() {
        return this.renderer;
    }

    public addUnit(id: number, modelName: string, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        this.unitsMap[id] = new GenericUnit(modelName, health, position, rotation, scale);
    }
    public getUnit(id: number) {
        return this.unitsMap[id];
    }
    public createScene() {
        const WIDTH = 1000;// window.innerWidth;
        const HEIGHT = 800;//window.innerHeight;
        const container = document.querySelector('#container');
        this.renderer = new Render();

        this.renderer.createScene(WIDTH, HEIGHT, container);

    }

    public createCamera() {
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const VIEW_ANGLE = 45;
        const ASPECT = WIDTH / HEIGHT;
        const NEAR = 0.1;
        const FAR = 10000;
        this.renderer.createCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    }

    public createLight() {
        this.renderer.createLight(0xFFFFFF, 10, 20, 30);
    }

    public update(){
        this.renderer.update();
    }
    
    constructor() {

    }

}