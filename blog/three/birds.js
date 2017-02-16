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
camera.position.z = 200;

controls = new THREE.OrbitControls( camera, renderer.domElement );

var stats = new Stats();
stats.showPanel( 1 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );


        // var lWing = new THREE.Geometry();
        // lWing.vertices.push(new THREE.Vector3(0, 0, 0));
        // lWing.vertices.push(new THREE.Vector3(0, 10, 0));
        // lWing.vertices.push(new THREE.Vector3(5, -5, 5));
        // lWing.faces.push(new THREE.Face3(0, 1, 2));
        // var lMesh = new THREE.Mesh(lWing, wingMaterial);
        // bird.add(lMesh);

        // var rWing = new THREE.Geometry();
        // rWing.vertices.push(new THREE.Vector3(0, 0, 0));
        // rWing.vertices.push(new THREE.Vector3(0, 10, 0));
        // rWing.vertices.push(new THREE.Vector3(5, -5, -5));
        // rWing.faces.push(new THREE.Face3(0, 1, 2));
        // var rMesh = new THREE.Mesh(rWing, wingMaterial);
        // bird.add(rMesh);


bodyMaterial = new THREE.MeshBasicMaterial({color: 0x0d7212, side: THREE.DoubleSide});
wingMaterial = new THREE.MeshBasicMaterial({color: 0x65c12c, side: THREE.DoubleSide});

class Bird {
    constructor() {
        var bird = new THREE.Object3D();

        var body = new THREE.Geometry();
        body.vertices.push(new THREE.Vector3(-3, 0, 0));
        body.vertices.push(new THREE.Vector3(0, 10, 0));
        body.vertices.push(new THREE.Vector3(3, 0, 0));
        body.faces.push(new THREE.Face3(0, 1, 2));
        var bMesh = new THREE.Mesh(body, bodyMaterial);
        bird.add(bMesh);


        var pos = new THREE.Vector3(Math.random() * 400 - 200, 
                                    Math.random() * 200 - 100,
                                    Math.random() * 200 - 100);

        var rot = new THREE.Vector3(Math.random() * 360,
                                    Math.random() * 360,
                                    Math.random() * 360);

        bird.position.set(pos.x, pos.y, pos.z);
        bird.rotation.set(rot.x, rot.y, rot.z);
        this.threeObject = bird;
        this.pos = pos;
        this.rot = rot;
    }

    getObject() {
        return this.threeObject;
    }

    lerpTo(newRot) {
        this.rot = newRot;
    }

    rotate() {
        var lerped = this.threeObject.rotation.toVector3().lerp(this.rot, 0.00015);
        this.threeObject.rotation.set(lerped.x, lerped.y, lerped.z);
    }
}

var birds = [];

for (var i = 0; i < 100; i++) {
    var bird = new Bird();
    birds.push(bird);
    scene.add(bird.getObject());
}


function render(){
    stats.begin();

    for (var i = 0; i < birds.length; i++) {
        var bird = birds[i];
        var deg = 60.0;
        var speed = 1.0;
        bird.getObject().translateY(speed);
        if (Math.random() < 0.01) {
            var randomRot = new THREE.Vector3(Math.random() * 360,
                                              Math.random() * 360,
                                              Math.random() * 360);
            bird.lerpTo(randomRot);
        }
        bird.rotate();
    }

    stats.end();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();