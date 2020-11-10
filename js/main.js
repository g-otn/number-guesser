(async () => {

  function getInputFromGrid(grid) {
    return grid.flat(1);
  }

  function formatPrediction(prediciton) {

  }

  $(document).ready(async () => {
  
    // Load model
    const net = new brain.NeuralNetwork({
      hiddenLayers: [16, 16],
      activation: 'sigmoid'
    });
    
    const model = await fetch('model.json').then(res => res.json());
    net.fromJSON(model)

    // Initialize digit pad
    const digitPad = new DigitPad($('#digit'), {
      columns: 28,
      rows: 28,
      cellSize: 14,
      brushWidth: 20,
      onBegin: e => { digitPad.clear(); },
      onStroke: e => {
        const grid = digitPad.getGrid()
        gridDisplay.drawGrid(grid);
        
        const input = getInputFromGrid(grid);
        const prediction = net.run(input);

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
    const gridDisplay = new DigitPad($('#digit2'), {
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