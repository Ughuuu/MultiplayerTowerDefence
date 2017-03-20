/// <reference path="../../../node_modules/@types/three/index.d.ts" />

class Render {
    scene: any;
    renderer: any;
    light: any;
    camera: any;
    constructor() {

    }
    CreateScene(width, height, container){
        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);
    }
    CreateCamera(viewAngle,aspect,near,far) { 
         this.camera =
            new THREE.PerspectiveCamera(
                viewAngle,
                aspect,
                near,
                far
            );
        this.scene.add(this.camera);
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
    update() {
      // Draw!
      this.renderer.render(this.scene, this.camera);

      // Schedule the next frame.
      requestAnimationFrame(function() {this.update() }.bind(this));
    }

    // Schedule the first frame.
   // requestAnimationFrame(function() { this.update() }.bind(this));
}
/*

   
*/