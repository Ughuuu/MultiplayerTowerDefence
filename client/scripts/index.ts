
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
    private creepTypes: UnitType[];
    private towerTypes: TowerType[];
    private clock: THREE.Clock;
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
    public setUnitTypes(unitTypes: UnitType[], progress) {
        this.creepTypes = unitTypes;
        for (let i = 0; i < this.creepTypes.length; i++) {
            {
                var loader = new THREE.JSONLoader();
                loader.load(this.creepTypes[i].model, function (icopy:number,geometry: THREE.Geometry, materials: any) {
                    let value: [THREE.Geometry, any] = [geometry, materials];
                    this.geometryMap[this.creepTypes[icopy].model] = value;
                    progress();
                }.bind(this, i));
            }
        }
    }

    public setTowerTypes(towerTypes: TowerType[], progress) {
        this.towerTypes = towerTypes;
        for (var i = 0; i < this.towerTypes.length; i++) {
            {
                var loader = new THREE.JSONLoader();
                loader.load(this.towerTypes[i].model, function (icopy: number, geometry: THREE.Geometry, materials: any) {
                    let value: [THREE.Geometry, any] = [geometry, materials];
                    this.geometryMap[this.towerTypes[icopy].model] = value;
                    var material = materials[0];
                    progress();
                }.bind(this, i));
            }
        }
    }
    public addCreep(id: number, type: number, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        let modelName = this.creepTypes[type].model;
        let newUnit = new GenericUnit(modelName, health, position, rotation, scale);
        this.unitsMap[id] = newUnit;
        this.unitsMap[id].loadModel(this.renderer.scene, this.geometryMap[modelName][0], this.geometryMap[modelName][1]);
    }
    public addTower(id: number, type: number, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        let modelName = this.towerTypes[type].model;
        let newUnit = new GenericUnit(modelName, health, position, rotation, scale);
        this.unitsMap[id] = newUnit;
        this.unitsMap[id].loadModel(this.renderer.scene, this.geometryMap[modelName][0], this.geometryMap[modelName][1]);
    }
    public getUnit(id: number) {
        let unit: GenericUnit = this.unitsMap[id];
        return unit;
    }
    public createScene() {

        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;
        const container = document.querySelector('#container');
        this.renderer = new Render();

        this.renderer.createScene(WIDTH, HEIGHT, container);
        this.clock = new THREE.Clock();

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

    public update() {
        var delta = this.clock.getDelta();
        for (var key in this.unitsMap) {
            this.unitsMap[key].update(delta);
        }
        this.renderer.update();
        requestAnimationFrame(function () { this.update() }.bind(this));
    }
    
    constructor() {
    }

}