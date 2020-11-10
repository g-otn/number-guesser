const MNIST = require('./node_modules/mnist/src/mnist');
const brain = require('brain.js');
const fs = require('fs');


// Get training data
const set = MNIST.set(45000, 15000); // Get 60000 digits
// const set = MNIST.set(8000, 2000);
const trainingData = [...set.training, ...set.test]; // No test is being made (not using brain.CrossValidation), so we can use the training and test sets as training data


// Structure and create neural network
const net = new brain.NeuralNetwork({
  hiddenLayers: [16, 16],
  activation: 'sigmoid'
});


// Train network with MNIST digits
console.log('Training with', trainingData.length, 'images');
net.train(trainingData, {
  log: true,
  logPeriod: 1
});


// Export neural network model to file
const model = net.toJSON();
const modelFilePath = '../client/model.json';
fs.writeFile(modelFilePath, JSON.stringify(model), 'utf8', () => console.log('Model exported to ' + modelFilePath));
