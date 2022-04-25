import WebGL from "./WebGL";
import * as THREE from "./js/three.module.js";
import {GLTFLoader} from "./js/GLTFLoader.js";
import {OrbitControls} from "./js/OrbitControls.js";

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
// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// move camera little bit away
camera.position.z = 200;
camera.position.y = 100;


//create a blue LineBasicMaterial
// const lineMaterial =  new THREE.LineBasicMaterial( { color: 0x0000ff } );

// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 10, 0 ) );
// points.push( new THREE.Vector3( 10, 0, 0 ) );

// const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
// const line = new THREE.Line( lineGeometry, lineMaterial );
// scene.add( line );


const loader = new GLTFLoader();
let chair;
loader.load( "./models/desk/scene.gltf", function ( gltf ) {
	chair = gltf.scene;
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 15 );
scene.add( light );

const backgroundColor = new THREE.Color( 0xa8def0 );
scene.background = backgroundColor;

const world = new THREE.CubeTextureLoader();
const folderName = 'yokohama';
const prefix = 'tron';
const format = '.png';
    const texture = world.load([
        './images/'+folderName+'/'+prefix+'_ft'+format,
        './images/'+folderName+'/'+prefix+'_bk'+format,
        './images/'+folderName+'/'+prefix+'_up'+format,
        './images/'+folderName+'/'+prefix+'_dn'+format,
        './images/'+folderName+'/'+prefix+'_rt'+format,
        './images/'+folderName+'/'+prefix+'_lf'+format
    ]);
scene.background = texture;


const controls = new OrbitControls(
	camera, renderer.domElement);
controls.target.set(0, 20, 0);
// controls.enablePan = false;
// controls.maxPolarAngle = Math.PI / 3;
controls.enableDamping = true;

// generateFloor();

function generateFloor() {
    // TEXTURES
    const textureLoader = new THREE.TextureLoader();
    const placeholder = textureLoader.load("./images/textures/placeholder/placeholder.png");
    const sandBaseColor = textureLoader.load("./images/textures/sand/Sand 002_COLOR.jpg");
    const sandNormalMap = textureLoader.load("./images/textures/sand/Sand 002_NRM.jpg");
    const sandHeightMap = textureLoader.load("./images/textures/sand/Sand 002_DISP.jpg");
    const sandAmbientOcclusion = textureLoader.load("./images/textures/sand/Sand 002_OCC.jpg");

    const WIDTH = 80
    const LENGTH = 80

    const geometry = new THREE.PlaneGeometry(WIDTH, LENGTH, 512, 512);
    const material = new THREE.MeshStandardMaterial(
        {
            map: sandBaseColor, normalMap: sandNormalMap,
            displacementMap: sandHeightMap, displacementScale: 0.1,
            aoMap: sandAmbientOcclusion
        })
    wrapAndRepeatTexture(material.map)
    wrapAndRepeatTexture(material.normalMap)
    wrapAndRepeatTexture(material.displacementMap)
    wrapAndRepeatTexture(material.aoMap)
    // const material = new THREE.MeshPhongMaterial({ map: placeholder})

    const floor = new THREE.Mesh(geometry, material)
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI / 2
    scene.add(floor)
}

function wrapAndRepeatTexture (map) {
    map.wrapS = map.wrapT = THREE.RepeatWrapping
    map.repeat.x = map.repeat.y = 10
}

//animate
function animate() {
	// cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
	
    // chair.rotation.y += 0.01;.
controls.update();

	renderer.render( scene, camera );
	animationId = requestAnimationFrame( animate );
}

if (WebGL.isWebGLAvailable() ) {

	// Initiate function or other initializations here
	animate();

} else {

	const warning = WebGL.getWebGLErrorMessage();
	document.getElementById( 'errors' ).appendChild( warning );

}