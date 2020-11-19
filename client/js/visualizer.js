/*
  Global variables to access libraries:
  THREE, CameraControls, mnist
*/
(() => {

  const OUTPUT_LAYER_NODE_MARGIN = 80;
  const HIDDEN_LAYER_NODE_MARGIN = 100;
  const INPUT_LAYER_PANEL_SIZE = 10;
  const XY_CENTER = (28 * INPUT_LAYER_PANEL_SIZE) / 2;
  const HIDDEN_LAYER_NODE_RADIUS = 10;
  const OUTPUT_LAYER_NODE_RADIUS = 15;
  const POSITIVE_WEIGHT_COLOR = [0, 204, 0];
  const NEGATIVE_WEIGHT_COLOR = [204, 0, 0];
  const LAYER_DISTANCE = 225;

  CameraControls.install({ THREE: THREE });

  function Visualizer($element) {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(); // create once
    this.model = {};
    this.inputCells = [];
    this.layers = [];
    this.layersWeights = [];

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
      this.scene.background = new THREE.Color(0x0f0f14);

      // Camera
      this.clock = new THREE.Clock();
      this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
      // this.camera.position.set(280 / 2, 280 / 2, 500);
      // this.camera.lookAt(new THREE.Vector3(80 / 2, 280 / 2, 500));

      // Controls
      this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
      this.resetCamera();

      // Ambient light
      this.scene.add(new THREE.AmbientLight(0xffffff));
      // Directional light
      // var light = new THREE.DirectionalLight(0xffffff, 1);
      // light.position.set(20, 20, 0);
      // this.scene.add(light);

      // Axes
      // this.scene.add(new THREE.AxesHelper(1000));

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
      this.loadInputLayer();

      // Mouse interaction
      this.loadEvents();
    }


    this.animate = () => {
      const delta = this.clock.getDelta();
      const hasControlsUpdated = this.cameraControls.update(delta);
      requestAnimationFrame(this.animate);

      // you can skip this condition to render though
      // if (hasControlsUpdated) { renderer.render(scene, camera);}
      this.renderer.render(this.scene, this.camera);
    }


    this.loadInputLayer = () => {
      const cellSize = 10;
      const inputCells = [];
      for (let y = 0; y < 28; y++) {
        inputCells[y] = [];
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
            (cellSize * 28 - x * cellSize) + (HIDDEN_LAYER_NODE_MARGIN / 2),
            (cellSize * 28 - y * cellSize) + (HIDDEN_LAYER_NODE_MARGIN / 2),
            0
          );

          // Add custom data to mesh
          inputCell.userData = {
            layer: 0,
            row: y,
            column: x
          }

          inputCells[y][x] = inputCell;

          this.scene.add(inputCell)
          // console.log(inputCell.material.color)
        }
      }

      this.layers[0] = inputCells;
    }


    this.loadEvents = () => {
      this.renderer.domElement.addEventListener('click', e => {
        // Calculate mouse 2D position on canvas based on mouse click and canvas position on document (accounting document scroll)
        const DOMRect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - DOMRect.left) / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = - ((e.clientY - DOMRect.top) / this.renderer.domElement.clientHeight) * 2 + 1;

        // Raycast from camera and check if it intersects something
        this.raycaster.setFromCamera(this.mouse, this.camera);
        // const allLayersNodes = this.layers[0].flat(1).concat(this.layers.splice(1).flat(1));
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        // console.log('Mouse at', this.mouse, 'intersections:', intersects);

        if (intersects.length > 0) {
          const intersection = intersects.find(o => o.object.type == 'Mesh' && o.object.userData.layer && o.object.userData.layer !== 0); // Has userData (not weight line)
          if (!intersection) return;

          console.log('Intersection with', intersection.object.type, 'at', this.mouse, intersection);

          const userData = intersects[0].object.userData;
          console.log('userData:', userData);

          this.showNodeWeights(userData.layer, userData.i);

          // Test (paint input)
          // if (userData.layer === 0) this.layers[0][userData.row][userData.column].material.color.setHex(0x0000aa)

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


          // Highlight
          if (userData.layer) {
            $('#visualizationGrids .digit-pad canvas').removeClass('clicked');
            if (userData.layer === 1) {
              $('#visualizationGrids .digit-pad canvas').eq(userData.i).addClass('clicked');
            } else if (userData.layer === this.layers.length - 1) {
              
            }
          }
        }
      });

      // Reset camera on spacebar keypress
      document.body.addEventListener('keypress', e => {
        if (e.code === 'Space') this.resetCamera();
      });
    }

    // Excepts a model with 28*28 input nodes and 10 outputs nodes
    this.loadModel = (model) => {
      this.model = model;
      const layerDistance = LAYER_DISTANCE, xyCenter = XY_CENTER;

      // Load hidden and output layers
      for (let l = 1; l < model.layers.length; l++) { // Skip input layer (index 0)
        this.layers[l] = [];
        this.layersWeights[l] = [];

        const nodes = Object.values(model.layers[l]);
        const rowCount = Math.ceil(Math.sqrt(nodes.length)); // (Visual) how many rows will the nodes be displayed with
        for (let n = 0; n < nodes.length; n++) {
          this.layersWeights[l][n] = [];

          const isOutputLayer = l === model.layers.length - 1;
          const nodeMargin = !isOutputLayer ? HIDDEN_LAYER_NODE_MARGIN : OUTPUT_LAYER_NODE_MARGIN;

          // Create node mesh
          const geometry = new THREE.SphereGeometry(isOutputLayer ? OUTPUT_LAYER_NODE_RADIUS : HIDDEN_LAYER_NODE_RADIUS, 40, 40);
          const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
          const node = new THREE.Mesh(geometry, material);

          // Add custom data
          node.userData = {
            layer: l,
            i: n,
          };

          // Calculate position
          let x, y;
          if (!isOutputLayer) { // Hidden layers
            const xyTopRight = xyCenter + (nodeMargin * rowCount) / 2;
            const row = n % rowCount, column = Math.floor(n / rowCount);
            x = xyTopRight - row * nodeMargin;
            y = xyTopRight - column * nodeMargin;
          } else {                             // Output layers
            const right = xyCenter + (nodeMargin * nodes.length) / 2; // Position of most right output layer node
            const visualColumn = n;
            x = right - nodeMargin * visualColumn;
            y = xyCenter;
          }
          node.position.set(x, y, layerDistance * l);


          // Store and add nodes to scene
          this.layers[l].push(node);
          this.scene.add(node);


          // Create node weights
          // Set position of each weight
          const weights = Object.values(this.model.layers[l][n].weights)
          for (let i = 0; i < weights.length; i++) {
            let point1;
            if (l - 1 === 0) {
              const nodePosition = this.layers[0][Math.floor(i / 28)][i % 28].position;
              point1 = new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z);
            } else {
              // console.log(l, i, this.layers[l - 1][i])
              const nodePosition = this.layers[l - 1][i].position;
              point1 = new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z);
            }

            const nodePosition = this.layers[l][n].position;
            const point2 = new THREE.Vector3(nodePosition.x, nodePosition.y, nodePosition.z)
            
            const color = weights[i] > 0 ? POSITIVE_WEIGHT_COLOR : NEGATIVE_WEIGHT_COLOR;
            const value = Math.log10(Math.abs(weights[i]));
            const weightMaterial = new THREE.LineBasicMaterial({ 
              color: `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255})` ,
              transparent: true,
              opacity: 0.1 + Math.min(value, 10) * 0.9
            });
            
            const weightGeometry = new THREE.BufferGeometry().setFromPoints([point1, point2]);
            const connection = new THREE.Line(weightGeometry, weightMaterial);
            if (l == 1) {
              connection.visible = false;
            }

            this.layersWeights[l][n][i] = connection;
            this.scene.add(connection);
          }
        }
      }

      console.log('Visualizer meshes:', this.layers)
      console.log('Visualizer weights:', this.layersWeights)
    }


    // Update colors of input cells
    this.updateInputCells = (grid) => {
      // inputCell.material.color.setHex(0xddffcc) // setRGB(,,)
      for (let y = 0; y < 28; y++) {
        for (let x = 0; x < 28; x++) {
          const grayValue = grid[y][x];
          this.layers[0][y][x].material.color.setRGB(grayValue, grayValue, grayValue);
          this.layers[0][y][x].userData.value = grid[y][x];
        }
      }
    }


    this.updateActivations = (activations) => {
      console.info('Updating nodes with activations:', activations);
      for (let l = 1; l < this.layers.length /* activations.length */; l++) {
        for (let n = 0; n < this.layers[l].length; n++) {
          const activation = activations[l][n];
          this.layers[l][n].material.color.setRGB(activation, activation, activation);
        }
      }
    }


    // Reset camera position and focus
    this.resetCamera = () => {
      if (this.cameraControls) {
        this.cameraControls.setLookAt(
          -500, XY_CENTER, -200,            // Position (to look from)
          XY_CENTER, XY_CENTER, 300,         // Target/Focus (to look at)
          true
        )
      }
      this.resetWeights();
      $('#visualizationGrids .digit-pad canvas').removeClass('clicked');
    }

    this.showNodeWeights = (layer, nodeIndex) => {
      if (!layer || layer == 0) return;

      this.hideWeights();

      const nodeWeights = this.layersWeights[layer][nodeIndex];
      console.log(nodeWeights);
      for (let w = 0; w < nodeWeights.length; w++) {
        nodeWeights[w].visible = true;
      }
    }

    this.hideWeights = () => {
      if (!this.layersWeights) return;

      for (let l = 1; l < this.layersWeights.length; l++) {
        for (let n = 0; n < this.layersWeights[l].length; n++) {
          for (let w = 0; w < this.layersWeights[l][n].length; w++) {
            this.layersWeights[l][n][w].visible = false;
          }
        }
      }
    }

    this.resetWeights = () => {
      if (!this.layersWeights) return;

      for (let l = 1; l < this.layersWeights.length; l++) {
        for (let n = 0; n < this.layersWeights[l].length; n++) {
          for (let w = 0; w < this.layersWeights[l][n].length; w++) {
            this.layersWeights[l][n][w].visible = l !== 1;
          }
        }
      }
    }
  }

  window.Visualizer = Visualizer;

})();
