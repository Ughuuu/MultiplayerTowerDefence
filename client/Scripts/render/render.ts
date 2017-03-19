/// <reference path="../../../node_modules/@types/three/index.d.ts" />

class Render {
    scene: any;
    renderer: any;
    light: any;
    constructor() {

    }
    CreateScene(width, height, container){
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);
    }
    CreateCamera(viewAngle,aspect,near,far) { 
        const camera =
            new THREE.PerspectiveCamera(
                viewAngle,
                aspect,
                near,
                far
            );
        this.scene.add(camera);
    }
    CreateLight(value,x,y,z) {
        const pointLight =
            new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // add to the scene
        this.scene.add(pointLight);
    }
    static update(state) {
        console.log(state);
    }
    static listen(number, message) {
        console.log('listen', number, message);
    }
    static onJoin(client, room) {
        console.log(client, "joined", room);
    }
}
/*

   
*/