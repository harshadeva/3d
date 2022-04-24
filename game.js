import WebGL from "./WebGL";
import * as THREE from "./node_modules/three/build/three.module.js";
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const FOV = 75;
const NEAR = 0.1;
const FAR = 1000;
let windowAspectRatio = windowWidth / windowHeight;
let animationId;

//create scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( FOV, windowAspectRatio, NEAR, FAR );

//create renderer and append to body
const renderer = new THREE.WebGLRenderer();
renderer.setSize( windowWidth, windowHeight);
document.body.appendChild( renderer.domElement );

//create a box
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// move camera little bit away
camera.position.z = 5;


//create a blue LineBasicMaterial
const lineMaterial =  new THREE.LineBasicMaterial( { color: 0x0000ff } );

const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );

const line = new THREE.Line( lineGeometry, lineMaterial );

scene.add( line );


// const loader = new GLTFLoader();

// loader.load( './path/to/model.glb', function ( gltf ) {

// 	scene.add( gltf.scene );

// }, undefined, function ( error ) {

// 	console.error( error );

// } );



//animate
function animate() {
	animationId = requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    camera.lookAt( 0, 0, 0 );

	renderer.render( scene, camera );
}

if (WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'errors' ).appendChild( warning );

}