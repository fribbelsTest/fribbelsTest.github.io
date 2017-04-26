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


var lookat = function(vecstart,vecEnd,vecUp){
    var temp = new THREE.Matrix4();
    temp.lookAt(vecEnd,vecstart,vecUp);
    var elem = temp.elements;

    // 00 01 02 03
    // 10 11 12 13
    // 20 21 22 23
    // 30 31 32 33

    // 0 1 2 3
    // 1 5 
    // 2 6
    // 3 7

    // var m00 = temp.n11, m10 = temp.n21, m20 = temp.n31,
    // m01 = temp.n12, m11 = temp.n22, m21 = temp.n32,
    // m02 = temp.n13, m12 = temp.n23, m22 = temp.n33;


    var m00 = elem[0], m10 = elem[4], m20 = elem[8],
        m01 = elem[1], m11 = elem[5], m21 = elem[9],
        m02 = elem[2], m12 = elem[6], m22 = elem[10];

    var t = m00 + m11 + m22,s,x,y,z,w;

    if (t > 0) { 
      s =  Math.sqrt(t+1)*2; 
      w = 0.25 * s;            
      x = (m21 - m12) / s;
      y = (m02 - m20) / s;
      z = (m10 - m01) / s;
    } else if ((m00 > m11) && (m00 > m22)) {
      s =  Math.sqrt(1.0 + m00 - m11 - m22)*2;
      x = s * 0.25;
      y = (m10 + m01) / s;
      z = (m02 + m20) / s;
      w = (m21 - m12) / s;
    } else if (m11 > m22) {
      s =  Math.sqrt(1.0 + m11 - m00 - m22) *2; 
      y = s * 0.25;
      x = (m10 + m01) / s;
      z = (m21 + m12) / s;
      w = (m02 - m20) / s;
    } else {
      s =  Math.sqrt(1.0 + m22 - m00 - m11) *2; 
      z = s * 0.25;
      x = (m02 + m20) / s;
      y = (m21 + m12) / s;
      w = (m10 - m01) / s;
    }

    var rotation = new THREE.Quaternion(x,y,z,w);
    rotation.normalize();
    return rotation;
};

bodyMaterial = new THREE.MeshBasicMaterial({color: 0x0d7212, side: THREE.DoubleSide});
wingMaterial = new THREE.MeshBasicMaterial({color: 0x65c12c, side: THREE.DoubleSide});

class Bird {
    constructor(point) {
        var bird = new THREE.Object3D();

        var body = new THREE.Geometry();
        body.vertices.push(new THREE.Vector3(-3, 0, 0));
        body.vertices.push(new THREE.Vector3(0, 0, 10));
        body.vertices.push(new THREE.Vector3(3, 0, 0));
        body.faces.push(new THREE.Face3(0, 1, 2));
        var bMesh = new THREE.Mesh(body, bodyMaterial);
        bird.add(bMesh);

        var rot = new THREE.Vector3(Math.random() * 360,
                                    Math.random() * 360,
                                    Math.random() * 360);

        bird.position.set(point.x, point.y, point.z);
        bird.rotation.set(rot.x, rot.y, rot.z);
        this.threeObject = bird;
        this.pos = point;
        this.rot = rot;
        this.quat = null;
    }

    getObject() {
        return this.threeObject;
    }

    lerpToPoint(point) {
        // var quat = lookat(point, this.threeObject.position, this.threeObject.up);
        // var start = this.threeObject.getWorldDirection();
        // var end = point;
        // var quaternion = new THREE.Quaternion().setFromUnitVectors( start.normalize(), end.normalize() );
        this.quat = point;
    }

    lerpTo(newRot) {
        this.rot = newRot;
    }

    rotate() {
        // this.threeObject.quaternion.slerp(this.quat, 0.51);
        this.threeObject.lookAt(this.quat);
        // var lerped = this.threeObject.rotation.toVector3().lerp(this.rot, 0.00015);
        // this.threeObject.rotation.set(lerped.x, lerped.y, lerped.z);
    }
}

function randPoint() {
    var point = new THREE.Vector3(Math.random() * 200 - 100, 
                                  Math.random() * 200 - 100,
                                  Math.random() * 200 - 100);
    return point;
}
var octRoot = new OctreeNode(new THREE.Vector3(0, 0, 0), new THREE.Vector3(2000, 2000, 2000));
octRoot.renderData();

var birds = [];
var datas = [];
for (var i = 0; i < 100; i++) {
    var point = randPoint();
    var bird = new Bird(point);

    data = new OctreePoint(bird, point);
    datas.push(data);
    birds.push(bird);
    octRoot.insert(data);
    scene.add(bird.getObject());
}

// octRoot.renderData();
function calcBirds () {
    for (var i = 0; i < birds.length; i++) {
        var bird = birds[i];
        var pos = bird.getObject().position;
        var arr = [];
        var width = 10;
        var bMin = new THREE.Vector3(pos.x - width, pos.y-width, pos.z-width);
        var bMax = new THREE.Vector3(pos.x + width, pos.y+width, pos.z+width);

        octRoot.delete(datas[i]);

        octRoot.getPointsInsideBox(bMin, bMax, arr);

        var dirSum = [0, 0, 0];
        var posSum = [0, 0, 0];
        var disSum = [0, 0, 0];

        var len = arr.length;
        for (var j = 0; j < len; j++) {
            var neighbor = arr[j].data;
            var heading = neighbor.threeObject.getWorldDirection();
            dirSum[0] += heading.x;
            dirSum[1] += heading.y;
            dirSum[2] += heading.z;

            posSum[0] += neighbor.threeObject.position.x; // object position not pos
            posSum[1] += neighbor.threeObject.position.y;
            posSum[2] += neighbor.threeObject.position.z;

            disSum[0] += neighbor.threeObject.position.x - bird.threeObject.position.x;
            disSum[1] += neighbor.threeObject.position.y - bird.threeObject.position.y;
            disSum[2] += neighbor.threeObject.position.z - bird.threeObject.position.z;
        }

        var dirW = -200;
        var posW = -0.5;
        var disW = -2;

        var dest = new THREE.Vector3(0, 0, 0);
        if (len > 0) {
            var pos = [posSum[0]/len, posSum[1]/len, posSum[2]/len];
            var dir = [dirSum[0]/len, dirSum[1]/len, dirSum[2]/len];
            var dis = [disSum[0]/len, disSum[1]/len, disSum[2]/len];

            dest = new THREE.Vector3(pos[0]*posW + dir[0]*dirW + dis[0]*disW,
                                         pos[1]*posW + dir[1]*dirW + dis[1]*disW,
                                         pos[2]*posW + dir[2]*dirW + dis[2]*disW)
        }
        var speed = 0.5;
        bird.lerpToPoint(dest);
        bird.rotate();
        bird.getObject().translateZ(speed);
        // console.log(arr.length);

        data = new OctreePoint(bird, bird.threeObject.position);
        datas[i] = data;
        octRoot.insert(data);
    }
}
function render(){
    stats.begin();
    calcBirds();
    // for (var i = 0; i < birds.length; i++) {
    //     var bird = birds[i];
    //     var deg = 60.0;
    //     var speed = 1.0;
    //     bird.getObject().translateY(speed);
    //     if (Math.random() < 0.01) {
    //         var randomRot = new THREE.Vector3(Math.random() * 360,
    //                                           Math.random() * 360,
    //                                           Math.random() * 360);
    //         bird.lerpTo(randomRot);
    //     }
    //     bird.rotate();
    // }

    stats.end();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();