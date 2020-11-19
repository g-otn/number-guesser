/*
  Global variables to access libraries:
  THREE, CameraControls, mnist
*/
(() => {

  CameraControls.install({ THREE: THREE });

  function Visualizer($element) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(); // create once
    this.model = {};
    this.inputCells = [];
    this.hiddenLayers = [];
    this.outputLayer = [];

    this.init = () => {
      // const width = window.innerWidth, height = window.innerHeight;
      const width = $element.width();
      // const height = width / (16 / 9) // $element.height();
      const height = Math.min(520, width / (16 / 9));
      console.log('Initalizing visualizer with width:', width, 'height:', height);

      // renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      $element.append(this.renderer.domElement);

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(`rgb(5, 5, 5)`);

      // Camera
      this.clock = new THREE.Clock();
      this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
      // this.camera.position.set(280 / 2, 280 / 2, 500);
      // this.camera.lookAt(new THREE.Vector3(80 / 2, 280 / 2, 500));

      // Controls
      this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
      this.cameraControls.setLookAt(
        -500, 280/2, -200,              // Position (to look from)
        280 / 2, 280 / 2, 300         // Target/Focus (to look at)
      )

      // Ambient light
      this.scene.add(new THREE.AmbientLight(0xffffff));
      // Directional light
      // var light = new THREE.DirectionalLight(0xffffff, 1);
      // light.position.set(20, 20, 0);
      // this.scene.add(light);

      // Axes
      this.scene.add(new THREE.AxesHelper(1000));

      // Test mesh
      // const geometry = new THREE.SphereGeometry(10, 20, 10);
      // const material = new THREE.MeshPhongMaterial({
      //   color: 0x33bbff,
      //   flatShading: true,
      //   transparent: true,
      //   opacity: 0.7,
      // });
      // mesh = new THREE.Mesh(geometry, material);
      // this.scene.add(mesh);


      // Input layer meshes
      const cellSize = 10;
      this.inputCells = [];
      for (let y = 0; y < 28; y++) {
        this.inputCells[y] = [];
        for (let x = 0; x < 28; x++) {
          // Create mesh
          const inputGeometry = new THREE.PlaneBufferGeometry(cellSize, cellSize);
          const inputMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
          })
          const inputCell = new THREE.Mesh(inputGeometry, inputMaterial);
          inputCell.position.set(
            (cellSize * 28 - x * cellSize), 
            (cellSize * 28 - y * cellSize), 
            0
          );

          // Add custom data to mesh
          inputCell.userData = {
            layer: 0,
            row: y,
            column: x
          }

          this.inputCells[y][x] = inputCell;

          this.scene.add(inputCell)
          // console.log(inputCell.material.color)
        }
      }

      // Mouse interaction
      this.renderer.domElement.addEventListener('click', e => {
        // Calculate mouse 2D position on canvas based on mouse click and canvas position on document (accounting document scroll)
        const DOMRect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - DOMRect.left) / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = - ((e.clientY - DOMRect.top) / this.renderer.domElement.clientHeight) * 2 + 1;

        // Raycast from camera and check if it intersects something
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        // console.log('Mouse at', this.mouse, 'intersections:', intersects);

        if (intersects.length > 0) {
          console.log('Intersection at', this.mouse, intersects[0]);

          const userData = intersects[0].object.userData;
          console.log('userData:', userData);

          this.inputCells[userData.row][userData.column].material.color.setHex(0x0000aa)

          // Test (draw line)
          // const material = new THREE.LineBasicMaterial( { color: 0x00ccff } );
          // const geometry = new THREE.BufferGeometry().setFromPoints([
          //   this.raycaster.ray.origin,
          //   intersects[0].point
          // ]);
          // const line = new THREE.Line( geometry, material );
          // this.scene.add( line );

          // Test (draw cube)
          // const geometry = new THREE.SphereGeometry(1, 40, 40);
          // const material = new THREE.MeshPhongMaterial({ color: 0x00eecc, transparent: true, opacity: 0.4, });
          // const testBall = new THREE.Mesh(geometry, material);
          // const point = intersects[0].point;
          // testBall.position.set(point.x, point.y, point.z);
          // this.scene.add(testBall);
        }
      });

      // Reset camera on spacebar keypress
      document.body.addEventListener('keypress', e => {
        if (e.code === 'Space') this.resetCamera();
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


    this.loadModel = (model) => {
      this.model = model;
      const layerDistance = 50, xyCenter = 280 / 2; 

      // Load hidden and output layers
      for (let l = 1; l < model.layers.length; l++) { // Skip input layer (index 0)
        const layer = model.layers[l];
        console.log('layer', l, layer)
        const rowCount = Math.ceil(Math.sqrt(layer)); // (Visual) how many rows will the nodes be displayed with

        const nodes = Object.values(layer);
        for (let n = 0; n < nodes.length; n++) {
          // Create node mesh
          const geometry = new THREE.SphereGeometry(20, 40, 40);
          const material = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, });
          const node = new THREE.Mesh(geometry, material);
  
          // Add custom data
          node.userData = {
            layer: l,
            i: n
          };

          // Place node
          
        }
      }
    }


    // Update colors of input cells
    this.updateInputCells = (grid) => {
      // inputCell.material.color.setHex(0xddffcc) // setRGB(,,)
      for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
          const grayValue = grid[y][x];
          this.inputCells[y][x].material.color.setRGB(grayValue, grayValue, grayValue);
          this.inputCells[y][x].userData.value = grid[y][x];
        }
      }
    }


    // Reset camera position and focus
    this.resetCamera = () => {
      if (this.cameraControls) {
        this.cameraControls.setLookAt(
          -500, 280/2, -200,            // Position (to look from)
          280 / 2, 280 / 2, 300,         // Target/Focus (to look at)
          true
        )
      }
    }
  }

  window.Visualizer = Visualizer;

})();
