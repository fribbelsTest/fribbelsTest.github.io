var width = window.innerWidth;
var height = window.innerHeight;

var scene    = new THREE.Scene();
var camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x69d3d0);
document.body.appendChild(renderer.domElement);

// (color, intensity)
var light = new THREE.PointLight(0xffffff, 1.2);

// (x, y, z)
light.position.set(0, 0, 6);
scene.add(light);

// move the camera back
camera.position.z = 249;
camera.position.x = 146;
camera.position.y = 189;
camera.lookAt(new THREE.Vector3(0, 0, 0));

controls = new THREE.OrbitControls( camera, renderer.domElement );

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );





function randVec(width) {
    return new THREE.Vector3(Math.random()*width - width/2, 
                             Math.random()*width - width/2, 
                             Math.random()*width - width/2);
}

var octRoot = new OctreeNode(new THREE.Vector3(0, 0, 0), new THREE.Vector3(200, 200, 200));

function addRand() {
    var point = randVec(200);
    addPoint(point);
}

objs = [];
var geometry = new THREE.BoxGeometry(2, 2, 2);
var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
function addPoint(point) {
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(point.x, point.y, point.z);

    scene.add(cube);
    // objs.push(cube);
    data = new OctreePoint(cube, point);
    octRoot.insert(data);

    octRoot.renderData();
    return data;
}

function delPoint(point) {
    octRoot.delete(new OctreePoint(null, point));
}


var point1 = randVec(200);
var point2 = randVec(200);

var cube1 = addPoint(point1);
var cube2 = addPoint(point2);
addRand();
// delPoint(point1);



// var geometry = new THREE.BoxGeometry(100, 100, 100);
// var material = new THREE.MeshBasicMaterial({color: 0x0fffff, wireframe: true});
// var cube = new THREE.Mesh(geometry, material);
// cube.position.set(50, 50, 50);
// scene.add(cube);

// var bMin = new THREE.Vector3(0, 0, 0);
// var bMax = new THREE.Vector3(100, 100, 100);
// console.log("insde:");
// var inside = [];
// octRoot.getPointsInsideBox(bMin, bMax, inside);
// console.log(inside.length);

// for (var i = 0; i < inside.length; i++) {
//     // inside[i].obj.material = new THREE.MeshBasicMaterial({color: 0xcc0000, wireframe: true});
//     // inside[i].obj.position = new THREE.Vector3(200, 200, 200);
//     // scene.add(inside[i].obj);
// }

function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function render(){
    stats.begin();
    
    stats.end();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();