const mnist = require('mnist');
const brain = require('brain.js');
const fs = require('fs');


// Get training data
const set = mnist.set(8000, 2000); // get all 10000 available mnist digits in the mnist package
const trainingData = [...set.training, ...set.test]; // No test is being made (not using brain.CrossValidation), so we can use the training and test sets as training data
console.log(trainingData.every(s => s.input && s.output))


// Structure and create neural network
const net = new brain.NeuralNetwork({
  hiddenLayers: [16, 16],
  activation: 'sigmoid'
});


// Train network with MNIST digits
console.log('Training...')
net.train(trainingData, {
  iterations: 20,
  log: true,
  logPeriod: 1
});


// Export neural network model to file
const model = net.toJSON();
const modelFilePath = '../client/model.json';
fs.writeFile(modelFilePath, JSON.stringify(model), 'utf8', () => console.log('Model exported to ' + modelFilePath));
