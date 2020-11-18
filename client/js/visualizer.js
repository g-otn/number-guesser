/*
  Global variables to access libraries:
  THREE, CameraControls, mnist
*/
(() => {

  function Visualizer($element) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(); // create once

    this.init = () => {
      // const width = window.innerWidth, height = window.innerHeight;
      const width = $element.width();
      const height = width / (16 / 9) // $element.height();
      console.log('Initalizing visualizer with width:', width, 'height:', height);

      // renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      $element.append(this.renderer.domElement);

      // Scene
      this.scene = new THREE.Scene();

      // Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
      this.camera.position.set(20, 20, 20);

      // Controls
      CameraControls.install({ THREE: THREE });
      this.clock = new THREE.Clock();
      this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
      this.camera.position.set(20, 20, 20);
      this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);

      // Ambient light
      this.scene.add(new THREE.AmbientLight(0x555555));
      // Directional light
      var light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(20, 20, 0);
      this.scene.add(light);

      // Axes
      this.scene.add(new THREE.AxesHelper(200));

      // Geometry
      const geometry = new THREE.SphereGeometry(10, 20, 10);
      // material
      const material = new THREE.MeshPhongMaterial({
        color: 0x33bbff,
        flatShading: true,
        transparent: true,
        opacity: 0.7,
      });
      // testMesh
      mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);


      // Input layer meshes
      for (let i = 0; i < 28; i++) {
        const inputGeometry = new THREE.PlaneBufferGeometry(10, 10);
        
      }



      // Mouse interaction
      this.renderer.domElement.addEventListener('click', e => {
        // Calculate mouse 2D position based on click and canvas position on document (accounting scroll)
        const DOMRect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - DOMRect.left) / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = - ((e.clientY - DOMRect.top) / this.renderer.domElement.clientHeight) * 2 + 1;

        // Raycast from camera and check if it intersects something
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        // console.log('Mouse at', this.mouse, 'intersections:', intersects);

        if (intersects.length > 0) {
          console.log('Intersection at', this.mouse, intersects[0]);

          // Test (draw line)
          // const material = new THREE.LineBasicMaterial( { color: 0x00ccff } );
          // const geometry = new THREE.BufferGeometry().setFromPoints([
          //   this.raycaster.ray.origin,
          //   intersects[0].point
          // ]);
          // const line = new THREE.Line( geometry, material );
          // this.scene.add( line );
          
          // Test (draw cube)
          const geometry = new THREE.SphereGeometry(1, 40, 40);
          const material = new THREE.MeshPhongMaterial({ color: 0x00eecc, transparent: true, opacity: 0.4, });
          const testBall = new THREE.Mesh(geometry, material);
          const point = intersects[0].point;
          testBall.position.set(point.x, point.y, point.z);
          this.scene.add(testBall);
        }
      });
    }

    this.animate = () => {
      const delta = this.clock.getDelta();
      const hasControlsUpdated = this.cameraControls.update(delta);
      requestAnimationFrame(this.animate);

      // you can skip this condition to render though
      // if (hasControlsUpdated) { renderer.render(scene, camera);}
      this.renderer.render(this.scene, this.camera);
    }

    this.updateInput = (grid) => {

    }
  }

  window.Visualizer = Visualizer;

})();
