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
camera.up = new THREE.Vector3(0,0,1);
// set camera to look object
camera.lookAt(scene.position);

renderer.setSize(width, height);
three_view.appendChild(renderer.domElement);

// Create plane (Floor)
{
    let geometryPlane = new THREE.PlaneBufferGeometry(40, 40); // 40 m x 40 m floor
    let material = new THREE.MeshPhongMaterial({
        color:0xAAAAAA,
        specular: 0x101010
    });
    let mesh = new THREE.Mesh(geometryPlane, material);
    mesh.position.z = -1 // move mesh 1 meter down 
    scene.add(mesh);
}

// Create 3D-cube for testing 
{
    let boxGeometry = new THREE.BoxGeometry(1,1,1); // box 1m x 1m x 1m
    let material = new THREE.MeshLambertMaterial({
    color: 0xff0000 // red
    });

    // Create new mesh for 3D-cube (geometry and material)
    let mesh = new THREE.Mesh(boxGeometry, material);
    // add cube to scene
    //scene.add(mesh);
}

// Add lights for the scene (color: gray, intensity)
let light = new THREE.DirectionalLight(0xAAAAAA, 1.5);
// set light position in 3D world
light.position.x = 10;
light.position.y = 10;
light.position.z = 10;
// Point light to center of 3D world
light.lookAt(scene.position);
scene.add(light);

// A light source positioned directly above the scene, with color fading from the sky color to the ground color.
// Properties: 
// skyColor - (optional) hexadecimal color of the sky. Default is 0xffffff.
// groundColor - (optional) hexadecimal color of the ground. Default is 0xffffff.
// intensity - (optional) numeric value of the light's strength/intensity. Default is 1.
scene.add(new THREE.HemisphereLight(0x443333,0x111122));

// add background 
scene.background = new THREE.Color(0xFFFFFF);
// add fog
// This class contains the parameters that define linear fog, i.e., that grows linearly denser with the distance.
// Fog( color : Integer, near : Float, far : Float )
scene.fog = new THREE.Fog(0xFFFFFF, 3, 30);

// ----------------------

// ---------------------------
// STL-LOADER (get CAD-files)
//---------------------------

const stl_loader = new THREE.STLLoader();
const load_stl = (url) => {
    return new Promise((resolve) => {
        stl_loader.load(url,resolve);
    });
};

// dark gray color for robot base 
let darkGray = new THREE.MeshLambertMaterial({
    color : 0x111111
});

// Fanuc yellow for joints
let yellow= new THREE.MeshLambertMaterial({
    color : 0xFFFF000
});

// array for all joint geometries
let joints =  [];

const load_geometries = async () => {
    {
        // get and draw robot base
        let robot_base = await load_stl('./FANUC_R2000iA165F-STL/BASE.stl');
        joints.push(new THREE.Mesh(robot_base, darkGray));
        // model is loaded in mm so it need to scale to meters
        joints[0].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[0]);
    }{
        // get and draw joint 1
        let joint1= await load_stl('./FANUC_R2000iA165F-STL/J1-1.stl');
        let joint1_2= await load_stl('./FANUC_R2000iA165F-STL/J1-2.stl');
        // merge joint1_2 to joint1 parts together
        joint1.merge(joint1_2);
        joints.push(new THREE.Mesh(joint1, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[1].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[1]);
      
    }{
        // get and draw joint 2
        let joint2= await load_stl('./FANUC_R2000iA165F-STL/J2.stl');
        joints.push(new THREE.Mesh(joint2, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[2].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[2]);
    }{
        // get and draw joint 3
        let joint3= await load_stl('./FANUC_R2000iA165F-STL/J3.stl');
        joints.push(new THREE.Mesh(joint3, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[3].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[3]);
    }{
        // get and draw joint 4
        let joint4= await load_stl('./FANUC_R2000iA165F-STL/J4.stl');
        joints.push(new THREE.Mesh(joint4, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[4].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[4]);
    }{
        // get and draw joint 5
        let joint5= await load_stl('./FANUC_R2000iA165F-STL/J5.stl');
        joints.push(new THREE.Mesh(joint5, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[5].geometry.scale(0.001, 0.001, 0.001);
        scene.add(joints[5]);
    }
};

load_geometries();

// Use orbit controls to control camera with mouse
const orbit_controls = new THREE.OrbitControls(camera, renderer.domElement);
orbit_controls.target = new THREE.Vector3(0,0,0);

//-----------------------

// draw function
const animate = () => {
    requestAnimationFrame(animate);
    //update camera location when using mouse to rotating
    orbit_controls.update();
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