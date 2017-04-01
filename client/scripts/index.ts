
/// <reference path="./render/render.ts" />
/// <reference path="./communication.ts" />
/// <reference path="./units/generic.unit.ts" />
/// <reference path="./units/unit.type.ts" />
class Main {
    private static instance: Main;

    private communication: Communication;
    private renderer: Render;
    private unitsMap = {};
    public geometryMap = {};
    private creepTypes: UnitType[];
    private towerTypes: TowerType[];
    private projectileTypes: ProjectileType[];
    private clock: THREE.Clock;
    private mouse: THREE.Vector2;
    private offset: { x: number, y: number };
    private raycaster: THREE.Raycaster;
    private windowHalfX: number;
    private windowHalfY: number;
    private INTERSECTED: any;
    private players: {} = {};
    private loader = new THREE.JSONLoader();
    private hud: Hud;
    static getInstance() {
        if (!Main.instance) {
            Main.instance = new Main();
        }
        return Main.instance;
    }

    setLife(id, life) {
        this.players[id] = life;
        const container = document.querySelector('#life');
        let str = "";
        for (let id in this.players) {
            str += 'Hp of ' + id + ': ' + this.players[id];
        }
        container.innerHTML = str;
    }

    constructor() {
        this.windowHalfX = 0;
        this.windowHalfY = 0;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        document.addEventListener('keydown', this.onKeyPress.bind(this));
    }

    public createCommunication(client) {
        this.communication = new Communication(client);
    }

    public getCommunication() {
        return this.communication;
    }

    public onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        this.renderer.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.camera.updateProjectionMatrix();
        this.renderer.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public getRenderer() {
        return this.renderer;
    }

    public setUnitTypes(unitTypes: UnitType[], progress) {
        this.creepTypes = unitTypes;
        for (let i = 0; i < this.creepTypes.length; i++) {
            {
                this.loader.load(this.creepTypes[i].model, function (icopy: number, geometry: THREE.Geometry, materials: any) {
                    try {
                        materials.forEach(function (material) {
                            material.side = THREE.DoubleSide;
                            material.skinning = true;
                        });
                        var material = new THREE.MultiMaterial(materials);
                        var object = new THREE.SkinnedMesh(geometry, material);
                        this.geometryMap[this.creepTypes[icopy].model] = object;
                    } catch (e) {
                        console.log(e);
                    }
                    progress();
                }.bind(this, i));
            }
        }
    }

    public setCell(progress) {
        this.loader.load('assets/tiles/cell.json', function (geometry: THREE.Geometry, materials: any) {
            try {
                materials.forEach(function (material) {
                    //material.side = THREE.DoubleSide;
                    //material.skinning = true;
                });
                var material = new THREE.MultiMaterial(materials);
                var object = new THREE.Mesh(geometry, material);
                let value: [THREE.Geometry, THREE.Mesh] = [geometry, object];
                this.geometryMap['assets/tiles/cell.json'] = value;
            } catch (e) {
                console.log(e);
            }
            progress();
        }.bind(this));
    }

    public setTowerTypes(towerTypes: TowerType[], progress) {
        this.towerTypes = towerTypes;
        for (var i = 0; i < this.towerTypes.length; i++) {
            {
                this.loader.load(this.towerTypes[i].model, function (icopy: number, geometry: THREE.Geometry, materials: any) {
                    try {
                        materials.forEach(function (material) {
                            material.skinning = false;
                            material.side = THREE.DoubleSide;
                        });
                        var material = new THREE.MultiMaterial(materials);
                        var object = new THREE.Mesh(geometry, material);
                        this.geometryMap[this.towerTypes[icopy].model] = object;
                    } catch (e) {
                        console.log(e);
                    }
                    progress();
                }.bind(this, i));
            }
        }
    }

    public setProjectileTypes(projectileTypes: ProjectileType[], progress) {
        this.projectileTypes = projectileTypes;
        for (var i = 0; i < this.projectileTypes.length; i++) {
            {
                this.loader.load(this.projectileTypes[i].model, function (icopy: number, geometry: THREE.Geometry, materials: any) {
                    try {
                        materials.forEach(function (material) {
                            //material.side = THREE.DoubleSide;
                        });
                        var material = new THREE.MultiMaterial(materials);
                        var object = new THREE.Mesh(geometry, material);
                        this.geometryMap[this.projectileTypes[icopy].model] = object;
                    } catch (e) {
                        console.log(e);
                    }
                    progress();
                }.bind(this, i));
            }
        }
    }

    public setMouse(event: any) {
        this.mouse.x = ((event.clientX - this.offset.x) / window.innerWidth) * 2 - 1;;
        this.mouse.y = - ((event.clientY - this.offset.y) / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse.clone(), this.renderer.camera);

        // calculate objects intersecting the picking ray
        let intersects: any = this.raycaster.intersectObjects(this.renderer.scene.children);
        let object: any;

        if (intersects.length > 0) {
            for (let i: number = 0; i < intersects.length; i++) {
                if (intersects[i].object.name == "cell") {
                    object = intersects[i].object;
                    break;
                }
            }
            if (this.INTERSECTED != object) {
                if (this.INTERSECTED) this.INTERSECTED.material.emissive.setHex(this.INTERSECTED.currentHex);
                this.INTERSECTED = object;
                this.INTERSECTED.currentHex = this.INTERSECTED.material.emissive.getHex();
                this.INTERSECTED.material.emissive.setHex(0xff0000);
            }
        }
    }

    public onMouseDown(event) {
        this.raycaster.setFromCamera(this.mouse.clone(), this.renderer.camera);
        // calculate objects intersecting the picking ray
        let intersects: any = this.raycaster.intersectObjects(this.renderer.scene.children);
        if (intersects.length > 0) {
            var x = this.renderer.convertGameCoorToMapCoord(intersects[0].object.position);
            this.hud.displayTowerInfo(this.towerTypes[0]);
            this.communication.createTower(0, x.x, x.y);
        }
        let position = this.renderer.convertGameCoorToMapCoord(new THREE.Vector3(this.mouse.x, this.mouse.y, 0));

    }

    public onKeyPress(event) {
        if (event.code == "Space") {
            this.communication.createUnit(0);
        }
    }

    public removeUnit(id: number) {
        this.renderer.scene.remove(this.unitsMap[id].mesh);
        delete this.unitsMap[id];
    }

    public addCreep(id: number, type: number, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        let modelName = this.creepTypes[type].model;
        let newUnit = new Creep(modelName, health, position, rotation, scale, this.renderer.scene, this.geometryMap[modelName]);
        this.unitsMap[id] = newUnit;
    }

    public addProjectile(id: number, type: number, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        let modelName = this.projectileTypes[type].model;
        let newUnit = new Projectile(modelName, health, position, rotation, scale, this.renderer.scene, this.geometryMap[modelName]);
        this.unitsMap[id] = newUnit;
    }

    public addTower(id: number, type: number, health: number, position: THREE.Vector3, rotation: THREE.Vector3, scale: number) {
        let modelName = this.towerTypes[type].model;
        let newUnit = new Tower(modelName, health, position, rotation, scale, this.renderer.scene, this.geometryMap[modelName]);
        this.unitsMap[id] = newUnit;
    }

    public getElementOffset(el) {
        for (var lx = 0, ly = 0;
            el != null;
            lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
        return { x: lx, y: ly };

    }

    public getUnit(id: number) {
        let unit: GenericUnit = this.unitsMap[id];
        return unit;
    }

    public createScene() {
        const WIDTH = window.innerWidth;
        const HEIGHT = window.innerHeight;

        const container = document.querySelector('#container');
        const hudContainer = document.querySelector('#hud');
        this.offset = this.getElementOffset(container);
        this.renderer = new Render();
        this.hud = new Hud(hudContainer);
        this.renderer.createScene(WIDTH, HEIGHT, container);
        this.clock = new THREE.Clock();

    }

    public onData(data) {
        const container = document.querySelector('#money');

        container.innerHTML = "Money:" + data.money + "<br> Income:" + data.income;
    }

    public setMap(map: number[][]) {
        this.renderer.camera.position.x+= (map[0].length * 20)/2;
        this.renderer.camera.position.y = -5 * map.length;
        this.renderer.camera.position.z = 20 * map.length;
        this.renderer.initMap(map, map[0].length, map.length, 20, 20);
        this.renderer.moveLights();
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
        this.renderer.createLight();
    }

    public update() {
        var delta = this.clock.getDelta();
        for (var key in this.unitsMap) {
            this.unitsMap[key].update(delta);
        }
        this.renderer.update();
        requestAnimationFrame(function () { this.update() }.bind(this));
    }
}