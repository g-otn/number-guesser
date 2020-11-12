(async () => {

  function getInputFromGrid(grid) {
    return grid.flat(1); // Transforms matrice in array
  }

  function formatPrediction(prediciton) {

  }

  function createVisualizationDigitPad($element) {
    return new DigitPad($element, {
      columns: 28,
      rows: 28,
      cellSize: 4,
      disablePad: true
    });
  }

  // https://stackoverflow.com/a/4492417/11138267
  function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}

  function getGridFromFirstHiddenLayerNode(node) {
    const weights = Object.values(node.weights);
    // for (let weightIndex = 0; weightIndex < weights.length; weightIndex++) {
    //   weights[weightIndex] = 1 / (1 + Math.exp(-weights[weightIndex]));
    // }
    return listToMatrix(weights, 28);
  }
  

  function getGridFromNode(node) {
    // const rows = [];
    // for (let i = 0; i < node.weights.length)
  }

  function showOutput(output) { // Display output layer values
    console.log('Showing output', output)
    $('#test').html('')
    // const result = $('<div></div>');
    output.forEach((v, i) => {
      const valueText = (Math.floor(v * 10000) / 100).toFixed(2) + '%';
      // const template = $($('#outputTemplate').html())
      // template.text(`${i} ${valueText}`);
      $('#test').append(`<br>&nbsp;${i}:&nbsp;&nbsp;&nbsp;${valueText}`)
      // result.append(template);
    });
  }
  

  $(document).ready(async () => {
  
    // Structure neural network
    const net = new brain.NeuralNetwork(brain.NeuralNetwork, {
      hiddenLayers: [16, 16],
      activation: 'sigmoid'
    });
    

    // Load model from JSON file (created from Node.js side training)
    const model = await fetch('model.json').then(res => res.json());
    net.fromJSON(model);
    console.log('Loaded model:', model);


    // Initialize first hidden layer visualization grids
    for (let nodeIndex = 0; nodeIndex < model.sizes[1]; nodeIndex++) {
      $('#visualizationGrids').append('<div class="digit-pad"></div>');

      const $padContainer = $('#visualizationGrids .digit-pad')[nodeIndex];
      const pad = createVisualizationDigitPad($padContainer);
      pad.init();
      
      const node = model.layers[1][nodeIndex];
      pad.drawGridColor(getGridFromFirstHiddenLayerNode(node));
      
    }


    // Initialize digit pad
    const digitPad = new DigitPad($('#digit'), {
      columns: 28,
      rows: 28,
      cellSize: 10,
      brushWidth: 14,
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

        // Display prediction
        const outputLayerIndex = model.sizes.length - 1;
        showOutput(prediction[outputLayerIndex]);
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