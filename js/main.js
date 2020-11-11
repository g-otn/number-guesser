(async () => {

  function getInputFromGrid(grid) {
    return grid.flat(1); // Transforms matrice in array
  }

  function formatPrediction(prediciton) {

  }

  function createVisualizationDigitPad($element) {
    console.log($element)
    return new DigitPad($element, {
      columns: 28,
      rows: 28,
      cellSize: 2,
      disablePad: true
    });
  }

  function getGridFromNode(node) {
    // const rows = [];
    // for (let i = 0; i < node.weights.length)
  }

  $(document).ready(async () => {
  
    // Structure neural network and load model
    const net = new brain.NeuralNetwork(brain.NeuralNetwork, {
      hiddenLayers: [16, 16],
      activation: 'sigmoid'
    });
    
    const model = await fetch('model.json').then(res => res.json());
    net.fromJSON(model);


    // Initialize first hidden layer visualization grids
    // console.log('Model sizes:', model.sizes);
    // for (let i = 0; i < model.sizes[1]; i++) {
    //   $('#visualizationGrids').append('<div class="digit-pad"></div>');
      
    //   const $padContainer = $('#visualizationGrids .digit-pad')[i];
      
    //   const pad = createVisualizationDigitPad($padContainer);
    //   pad.init();
      
    // }


    // Initialize digit pad
    const digitPad = new DigitPad($('#digit'), {
      columns: 28,
      rows: 28,
      cellSize: 10,
      brushWidth: 15,
      onBegin: e => { digitPad.clear(); },
      onStroke: e => {
        // Draw grid in digitPad (pixelated mirror of #digit)
        const grid = digitPad.getGrid()
        gridDisplay.drawGrid(grid);
        
        // Get input for neural network
        const input = getInputFromGrid(grid);

        // Predict
        const prediction = net.run(input);
        console.info('Prediction:', prediction);

        // Test - display prediction
        let test = {};
        for (let key in prediction) {
          if (prediction.hasOwnProperty(key)) {
            test[key] = Math.floor(prediction[key] * 100000) / 1000; // round percentages
          }
        }
        $('#test').text(JSON.stringify(test, null, '\t'));
      }
    });
    digitPad.init();

  
    // Initialize grid display (used to show 'grid' of drawn digit)
    const gridDisplay = new DigitPad($('#gridDisplay'), {
      columns: 28,
      rows: 28,
      cellSize: 10,
      brushWidth: 5,
      disablePad: true
    });
    gridDisplay.init();

  
    // Initialize three.js visualizer
    const visualizer = new Visualizer($('#visualizer'), {
      width: window.innerWidth,
      height: 400
    });
    visualizer.init();
    visualizer.animate();

  });

})();