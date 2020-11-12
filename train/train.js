const mnist = require('mnist');
const brain = require('brain.js');
const fs = require('fs');


// Get training data
const set = mnist.set(45000, 15000); // Get training and testing sets
const trainingData = [...set.training, ...set.test]; // brain.CrossValidation will divide the data set into training and testing internally, so we send them altogether


// Structure and create neural network
const netOptions = {
  hiddenLayers: [16, 16],
  activation: 'sigmoid'
};
// const net = new brain.NeuralNetwork(netOptions);
const crossValidate = new brain.CrossValidate(brain.NeuralNetwork, netOptions); 


// Train neural network with MNIST digits
console.log('Training with', trainingData.length, 'images');
crossValidate.train(trainingData, {
  // learningRate: 0.01,
  errorThresh: 0.003,
  iterations: 300,
  log: true,
  logPeriod: 1
});


// Export neural network model to file
const model = crossValidate.toNeuralNetwork().toJSON();
// const model = net.toJSON();
const modelFilePath = '../client/model.json';
fs.writeFile(modelFilePath, JSON.stringify(model), 'utf8', err => {
  if (err) throw err;
  else console.log('Model exported to ' + modelFilePath);
});
