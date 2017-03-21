
/// <reference path="./render/render.ts" />
/// <reference path="./communication.ts" />
/// <reference path="./units/generic.unit.ts" />
/// <reference path="./units/unit.type.ts" />
class Main {
    private static instance: Main;

    private communication: Communication;
    private renderer: Render;
    private unitsMap = {};
    private geometryMap = {};
    private unitTypes: UnitType[];
    private towerTypes: TowerType[];
    private unitsCount: any;
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
    public setUnitTypes(unitTypes: UnitType[]) {
        this.unitTypes = unitTypes;
        for (let i = 0; i < this.unitTypes.length; i++) {
            {
                var loader = new THREE.JSONLoader();
                loader.load(this.unitTypes[i].model, function (icopy:number,geometry: THREE.Geometry, materials: any) {
                    console.log(arguments);
                    let value: [THREE.Geometry, any] = [geometry, materials];
                    this.geometryMap[this.unitTypes[icopy].model] = value;
                    var material = materials[0];
                }.bind(this, i));
            }
        }
    }

    public setTowerTypes(towerTypes: TowerType[]) {
        this.towerTypes = towerTypes;
        for (var i = 0; i < this.towerTypes.length; i++) {
            {
                var loader = new THREE.JSONLoader();
                loader.load(this.towerTypes[i].model, function (icopy: number, geometry: THREE.Geometry, materials: any) {
                    console.log(arguments);
                    let value: [THREE.Geometry, any] = [geometry, materials];
                    this.geometryMap[this.towerTypes[icopy].model] = value;
                    var material = materials[0];
                }.bind(this, i));
            }
        }
    }
    public addUnit(id: number, modelName: string, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        this.unitsMap[id] = new GenericUnit(modelName, health, position, rotation, scale);
        this.unitsMap[id].loadModel(this.renderer.scene, this.geometryMap[modelName][0], this.geometryMap[modelName][1]);
        this.unitsCount = this.unitsCount + 1;
        (<HTMLInputElement>document.getElementById("input")).value = this.unitsCount;
    }
    public getUnit(id: number) {
        let unit: GenericUnit = this.unitsMap[id];
        return unit;
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
        this.unitsCount = 0;
    }

}