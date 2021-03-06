# [number-guesser](https://g-otn.github.io/number-guesser/)

This repo holds the code to train a simple digit recognizing feed foward neural network
with [the MNIST database](http://yann.lecun.com/exdb/mnist/) digits and also [a website](https://g-otn.github.io/number-guesser) which allows the user to draw digits and visualize
the neural network prediction of the drawings.

<p align="center">
   <img src="https://user-images.githubusercontent.com/44736064/100669492-3c709e80-333c-11eb-9b54-540d844f4eda.gif">
</p>

### Usage
- Draw digit on the "Digit" canvas
- Click on node to highlight it's weights
- Check [table](https://github.com/yomotsu/camera-controls#examples) for camera controls in the 3D visualizer
- <kbd>Space</kbd> to reset weights and camera

## Installation

First, clone the repository: 
```bash
git clone https://github.com/g-otn/number-guesser.git
cd number-guesser
```

### Client
If you do not wish to train a new neural network, you can simply serve the `client/` folder:
1. `npm i -g serve`
2. `serve client` or `cd train && npm run-script serve`


### Training

If you wish to run the training script to generate a new model, follow these steps. Steps 1-3 are optional, but if you wish to skip them, please read Note 2 below:

0. Navigate to the `train/` folder: `cd train`
1. **BEFORE** creating `node_modules/` (i.e `npm i`) in the `train/` folder, download these two files from [the MNIST database](http://yann.lecun.com/exdb/mnist/):
   - [train-images-idx3-ubyte.gz](http://yann.lecun.com/exdb/mnist/train-images-idx3-ubyte.gz):  training set images (9912422 bytes) 
   - [train-labels-idx1-ubyte.gz](http://yann.lecun.com/exdb/mnist/train-labels-idx1-ubyte.gz):  training set labels (28881 bytes)
2. Extract the two files into the `data/` folder:
```
data
├───train-images-idx3-ubyte
└───train-labels-idx1-ubyte
```
Note: Notice the `-` character in the file names.
You may need to rename them (replacing the `.` for `-`) if you get an file not found error in the next step.

3. Install the packages: `npm i`. A post-install npm script should do all the work with the files.

4. Run `npm start` or `node train.js`

5. After training ends the model file will already be in the right path to be loaded by the browser.

Note 2: If something goes wrong during steps 1-3 you can skip it, however you will need to edit the [`train.js`](train/train.js) file and lower the mnist set to a sum <= 10000. (i.e `mnist.set(8000, 2000)`. Otherwise the training might log `NaN`s and save an invalid model.

#### Using your own model
If you already have an exported brain.js model, you can replace the [`client/model.json`](client/model.json) file so the client can use your model instead.
Because of hard-coded code, and since it's using a poorly [modified version](client\js\vendors\brain.js@2.0.0-beta.2\dist\brain-browser.js) of `brain-browser.js`, the client requires the model to have this structure for the visualization to work:
- [Type](https://github.com/BrainJS/brain.js#neural-network-types): feed forward (`brain.NeuralNetwork`)
- Layers: 784 nodes input layer (28\*28 image pixels), at least one [hidden layer](https://github.com/BrainJS/brain.js#hiddenlayers), 10 nodes output layer (digits 0-9)
- [Activation function](https://github.com/BrainJS/brain.js#activation): `sigmoid`

## Built with
- Training: [Brain.js](https://brain.js.org/#/), [cazala](https://github.com/cazala)/[mnist](https://github.com/cazala/mnist)
- Visualization: [three.js](https://threejs.org)

## Acknowledgements
This repo was highly motivated by [3Blue1Brown](https://www.youtube.com/c/3blue1brown)'s [videos on Neural Networks](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi).

Most of the training code was based on [Ralph's Blog](https://golb.hplar.ch) article 
on "[Machine Learning with brain.js and Tensorflow.js](https://golb.hplar.ch/2019/01/machine-learning-with-brain-and-tensorflow-js.html)".

Thanks to MSc Adriana Natividad Lopez Valverde for assigning me the project related to this repo.

## License
[MIT](/LICENSE)

This repo uses a [modified version](client\js\vendors\brain.js@2.0.0-beta.2\dist\brain-browser.js) of a [BrainJS](https://github.com/BrainJS)/[brain.js](https://github.com/BrainJS/brain.js) file, licensed under MIT.
