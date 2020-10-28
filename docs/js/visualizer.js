// Simple three.js example

import * as THREE from "https://unpkg.com/three@0.118.3/build/three.module.js";
// import { OrbitControls } from "https://unpkg.com/three@0.118.3/examples/jsm/controls/OrbitControls.js";
import CameraControls from 'https://unpkg.com/camera-controls/dist/camera-controls.module.js';

var mesh, renderer, scene, camera, controls,
  clock, cameraControls;

init();
animate();

function init() {
  const width = window.innerWidth, height = window.innerHeight;

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera( 40, width / height, 1, 10000 );
  camera.position.set( 20, 20, 20 );

  CameraControls.install({ THREE: THREE });
  clock = new THREE.Clock();
  camera = new THREE.PerspectiveCamera(40, width / height, 1, 10000);
  camera.position.set(20, 20, 20);
  cameraControls = new CameraControls(camera, renderer.domElement);

  // controls
  // controls = new OrbitControls(camera, renderer.domElement);

  // ambient
  scene.add(new THREE.AmbientLight(0x222222));

  // light
  var light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(20, 20, 0);
  scene.add(light);

  // axes
  scene.add(new THREE.AxesHelper(20));

  // geometry
  var geometry = new THREE.SphereGeometry(5, 12, 8);

  // material
  var material = new THREE.MeshPhongMaterial({
    color: 0x00ffff,
    flatShading: true,
    transparent: true,
    opacity: 0.7,
  });

  // mesh
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

}

function animate() {
  const delta = clock.getDelta();
  const hasControlsUpdated = cameraControls.update(delta);
  requestAnimationFrame(animate);

  // you can skip this condition to render though
  // if (hasControlsUpdated) { renderer.render(scene, camera);}
    renderer.render(scene, camera);

}
