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
        // scene.add(joints[0]);
    }{
        // get and draw joint 1
        let joint1= await load_stl('./FANUC_R2000iA165F-STL/J1-1.stl');
        let joint1_2= await load_stl('./FANUC_R2000iA165F-STL/J1-2.stl');
        // merge joint1_2 to joint1 parts together
        
        joint1.merge(joint1_2);
        joints.push(new THREE.Mesh(joint1, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[1].geometry.scale(0.001, 0.001, 0.001);
        // scene.add(joints[1]);
      
    }{
        // get and draw joint 2
        let joint2= await load_stl('./FANUC_R2000iA165F-STL/J2.stl');
        joints.push(new THREE.Mesh(joint2, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[2].geometry.scale(0.001, 0.001, 0.001);
        // scene.add(joints[2]);
    }{
        // get and draw joint 3
        let joint3= await load_stl('./FANUC_R2000iA165F-STL/J3.stl');
        joints.push(new THREE.Mesh(joint3, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[3].geometry.scale(0.001, 0.001, 0.001);
        // scene.add(joints[3]);
    }{
        // get and draw joint 4
        let joint4= await load_stl('./FANUC_R2000iA165F-STL/J4.stl');
        joints.push(new THREE.Mesh(joint4, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[4].geometry.scale(0.001, 0.001, 0.001);
        // scene.add(joints[4]);
    }{
        // get and draw joint 5
        let joint5= await load_stl('./FANUC_R2000iA165F-STL/J5.stl');
        joints.push(new THREE.Mesh(joint5, yellow));
        // model is loaded in mm so it need to scale to meters
        joints[5].geometry.scale(0.001, 0.001, 0.001);
        // scene.add(joints[5]);
    }
};

// offset to move joints to correct position
let offsets = [];

// get robot geometries and build robot 3D-model
load_geometries().then(() =>{
    
    // move all part to origin 
    // J1: [0, 282,0] Y
    // J2: [312, 670, -117] Z
    // J3: [268.69, 1744.13, -196.85] Z
    // J4: [1315.19, 1969.13, 0.15] X
    // J5: [1548.69, 1969.13, 87.15] Z
    // J6: [1763.69, 1969.13, 20.47] X

    joints[1].geometry.translate(0, -0.282, 0); 
    joints[2].geometry.translate(-0.312, -0.670, 0.117);
    joints[3].geometry.translate(-0.26869, -1.74413, 0.19685);
    joints[4].geometry.translate(-1.31519, -1.96913, 0.15);
    joints[5].geometry.translate(-1.54869, -1.96913, 0.8715);

    // add robot base
    scene.add(joints[0]);

    // rotate robot to corret position z-axis to up
    joints[0].rotation.set(THREE.Math.degToRad(90),0,0);

    // J1 crete new group of transformations 
    offsets.push(new THREE.Group());
    // distance from origo to rotating joint
    offsets[0].position.set(0, 0.282,0);
    joints[0].add(offsets[0]);
    offsets[0].add(joints[1]);

    // J2 crete new group of transformations 
    offsets.push(new THREE.Group());
    // calculate joints difference J2 -J1 offset where joint attached
    offsets[1].position.set(0.312, 0.388, -0.117);
    joints[1].add(offsets[1]);
    offsets[1].add(joints[2]);

    // J3 crete new group of transformations 
    offsets.push(new THREE.Group());
    // calculate joints difference J3 -J2 offset where joint attached
    offsets[2].position.set(-0.04331, 1.07413, -0.0798);
    joints[2].add(offsets[2]);
    offsets[2].add(joints[3]);

    // J4 crete new group of transformations 
    offsets.push(new THREE.Group());
    // calculate joints difference J4 -J3 offset where joint attached
    offsets[3].position.set(1.0465, 0.225, 0.0468);
    joints[3].add(offsets[3]);
    offsets[3].add(joints[4]);

    // J5 crete new group of transformations 
    offsets.push(new THREE.Group());
    // calculate joints difference J5 -J4 offset where joint attached
    offsets[4].position.set(0.2335, 0, -0.7215);
    joints[4].add(offsets[4]);
    offsets[4].add(joints[5]);

});

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


// MQTT-client connection
//-----------------------

const MQTT_BROKER_ADDRESS = 'wss://auoh20-mqtt-broker.herokuapp.com';
const mqtt_client = mqtt.connect(MQTT_BROKER_ADDRESS);

mqtt_client.on('connect', () => {
    console.log('connected to MQTT-server');
    mqtt_client.subscribe('joints');
});

mqtt_client.on('message', (topic, message) => {

    // wait until all joint geometries are loaded
    if (joints.length == 6){

        const joint_data = JSON.parse(message);
        // read values and rotate joint aroud y-axis
        joints[1].rotation.set(0, THREE.Math.degToRad(joint_data.joints[0]), 0);
        // read values and rotate joint aroud Z-axis
        joints[2].rotation.set(0,0,THREE.Math.degToRad(joint_data.joints[1]));
        // read values and rotate joint aroud Z-axis
        joints[3].rotation.set(0,0,THREE.Math.degToRad(joint_data.joints[2]) - THREE.Math.degToRad(joint_data.joints[1]));
    }  
});

