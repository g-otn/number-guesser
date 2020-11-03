/*
  Global variables to access libraries:
  THREE, CameraControls, mnist
*/
(() => {

  function Visualizer(element) {

    this.init = () => {
      const width = window.innerWidth, height = window.innerHeight;
    
      // renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      element.appendChild(this.renderer.domElement);
    
      // Scene
      this.scene = new THREE.Scene();
    
      // Camera
      this.camera = new THREE.PerspectiveCamera( 40, width / height, 1, 10000 );
      this.camera.position.set( 20, 20, 20 );
    
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
      var geometry = new THREE.SphereGeometry(1, 20, 10);
      // material
      var material = new THREE.MeshPhongMaterial({
        color: 0x33bbff,
        flatShading: true,
        transparent: true,
        opacity: 0.7,
      });
      // Mesh
      mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    }

    this.animate = () => {
      const delta = this.clock.getDelta();
      const hasControlsUpdated = this.cameraControls.update(delta);
      requestAnimationFrame(this.animate);

      // you can skip this condition to render though
      // if (hasControlsUpdated) { renderer.render(scene, camera);}
      this.renderer.render(this.scene, this.camera);
    }

  }

  window.Visualizer = Visualizer;

})();
