var width = window.innerWidth;
var height = window.innerHeight;

var scene    = new THREE.Scene();
var camera   = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x3399ff);
document.body.appendChild(renderer.domElement);

bodyMaterial = new THREE.MeshBasicMaterial({color: 0x0d7212, side: THREE.DoubleSide});
wingMaterial = new THREE.MeshBasicMaterial({color: 0x65c12c, side: THREE.DoubleSide});

class Bird {
    constructor() {
        var bird = new THREE.Object3D();

        var body = new THREE.Geometry();
        body.vertices.push(new THREE.Vector3(-1, 0, 0));
        body.vertices.push(new THREE.Vector3(0, 10, 0));
        body.vertices.push(new THREE.Vector3(1, 0, 0));
        body.faces.push(new THREE.Face3(0, 1, 2));
        var bMesh = new THREE.Mesh(body, bodyMaterial);
        bird.add(bMesh);

        var lWing = new THREE.Geometry();
        lWing.vertices.push(new THREE.Vector3(0, 0, 0));
        lWing.vertices.push(new THREE.Vector3(0, 10, 0));
        lWing.vertices.push(new THREE.Vector3(5, -5, 5));
        lWing.faces.push(new THREE.Face3(0, 1, 2));
        var lMesh = new THREE.Mesh(lWing, wingMaterial);
        bird.add(lMesh);

        var rWing = new THREE.Geometry();
        rWing.vertices.push(new THREE.Vector3(0, 0, 0));
        rWing.vertices.push(new THREE.Vector3(0, 10, 0));
        rWing.vertices.push(new THREE.Vector3(5, -5, -5));
        rWing.faces.push(new THREE.Face3(0, 1, 2));
        var rMesh = new THREE.Mesh(rWing, wingMaterial);
        bird.add(rMesh);

        var pos = new THREE.Vector3(Math.random() * 400 - 200, 
                                    Math.random() * 200 - 100,
                                    Math.random() * 200 - 100);

        var rot = new THREE.Vector3(Math.random() * 360,
                                    Math.random() * 360,
                                    Math.random() * 360);

        bird.position.set(pos.x, pos.y, pos.z);
        bird.rotation.set(rot.x, rot.y, rot.z);
        this.bird = bird;
        this.pos = pos;
        this.rot = rot;
    }

    getMesh() {
        return this.bMesh;
    }

    getBird() {
        return this.bird;
    }

    lerpTo(newRot) {
        this.rot = newRot;
    }

    rotate() {
        if (this.bird.rotation.toVector3().distanceTo(this.rot) > 2) {
            var lerped = this.bird.rotation.toVector3().lerp(this.rot, 0.0001);
            this.bird.rotation.set(lerped.x, lerped.y, lerped.z);
        }
    }
}

var birds = [];

for (var i = 0; i < 100; i++) {
    var bird = new Bird();
    birds.push(bird);
    scene.add(bird.getBird());
}

// (color, intensity)
var light = new THREE.PointLight(0xffffff, 1.2);

// (x, y, z)
light.position.set(0, 0, 6);
scene.add(light);

// move the camera back
camera.position.z = 200;

controls = new THREE.OrbitControls( camera, renderer.domElement );


function render(){
    requestAnimationFrame(render);

    for (var i = 0; i < birds.length; i++) {
        var bird = birds[i];
        var deg = 60.0;
        var speed = 1.0;
        bird.getBird().translateY(speed);
        if (Math.random() < 0.02) {
            var randomRot = new THREE.Vector3(Math.random() * deg - deg/2,
                                              Math.random() * deg - deg/2,
                                              Math.random() * deg - deg/2);
            bird.lerpTo(randomRot);
            // var rot = bird.getBird().rotation.toVector3() + new THREE.Vector3(Math.random() * deg - deg/2,
            //                                                                   Math.random() * deg - deg/2,
            //                                                                   Math.random() * deg - deg/2);
            // bird.rot = rot;
        }
        bird.rotate();

        // bird.setRotationFromEuler(bird.rotation + new THREE.Vector3(Math.random() * deg - deg/2,
        //                                                             Math.random() * deg - deg/2,
        //                                                             Math.random() * deg - deg/2));
    }

    renderer.render(scene, camera);
}
render();

/*
// Set up screen
var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
 
var scene = new THREE.Scene;

// Make cube
var cubeGeometry = new THREE.CubeGeometry(100, 100, 100);
var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x1ec876 });
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.rotation.y = Math.PI * 45 / 180;
 
scene.add(cube);

// Add triangle

var geometry = new THREE.Geometry();
var v1 = new THREE.Vector3(0,0,0);
var v2 = new THREE.Vector3(10,0,0);
var v3 = new THREE.Vector3(0,10,0); 

geometry.vertices.push(v1);
geometry.vertices.push(v2);
geometry.vertices.push(v3);

scene.add(geometry)

// Add camera
var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.y = 160;
camera.position.z = 400;

scene.add(camera);

// Add skybox
var skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
var skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide });
var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
 
scene.add(skybox);

// Add light
var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, 300, 200);
 
scene.add(pointLight);

// Render
camera.lookAt(cube.position);

var clock = new THREE.Clock;
renderer.setClearColor(0xBBBBBB);

function render() {
    renderer.render(scene, camera);
    cube.rotation.y -= clock.getDelta();

    requestAnimationFrame(render);
}
 
render();
*/