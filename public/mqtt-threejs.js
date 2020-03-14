// get correct div element from html-document
let three_view = document.getElementById('three_view');

// create new webGL renderer
let renderer = new THREE.WebGLRenderer();

// create new scene
let scene = new THREE.Scene();

// window settings

let width = window.innerWidth;
let height = window.innerHeight;
let view_angle = 45;

// set clipping planes
let near = 0.1 ; // meters
let far = 1000; // meters

/**
 *  Crate new Perspective camera
 *  Parameters:
 *  PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
 *  fov — Camera frustum vertical field of view.
 *  aspect — Camera frustum aspect ratio.
 *  near — Camera frustum near plane.
 *  far — Camera frustum far plane. 
 */

let camera = new THREE.PerspectiveCamera( view_angle, width / height, near, far );

// default camera is located in origo
// move camera 5 meters in every direction
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

renderer.setSize(width, height);
three_view.appendChild(renderer.domElement);

// draw function
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
};
animate();

// Window resize function 
const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

// Run resize function 
window.onresize = resize;