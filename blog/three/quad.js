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


class OctreePoint {
    constructor(data, position) {
        this.data = data;
        this.position = position;
    }

    getPosition() {
        return this.position;
    }
}

class OctreeNode {
    constructor(origin, halfDimension) {
        this.origin = origin;
        this.halfDimension = halfDimension;
        this.children = [null, null, null, null, null, null, null, null];
        this.data = null;
        this.rendering = false;
    }

    getOctantContainingPoint(point) {
        var oct = 0;
        if (point.x >= this.origin.x)
            oct |= 4;
        if (point.y >= this.origin.y)
            oct |= 2;
        if (point.z >= this.origin.z)
            oct |= 1;
        return oct;
    }

    isLeaf() {
        return this.children[0] == null;

    }

    insert(point) {
        if (this.isLeaf()) {
            if (this.data == null) {
                // console.log("a");
                this.data = point;
            } else {
                // console.log("b");
                var oldPoint = this.data;
                this.data = null;

                for (var i = 0; i < 8; i++) {
                    var newOrigin = new THREE.Vector3(this.origin.x, this.origin.y, this.origin.z);
                    newOrigin.x += this.halfDimension.x * (i&4 ? 0.5 : -0.5);
                    newOrigin.y += this.halfDimension.y * (i&2 ? 0.5 : -0.5);
                    newOrigin.z += this.halfDimension.z * (i&1 ? 0.5 : -0.5);
                    this.children[i] = new OctreeNode(newOrigin, new THREE.Vector3(this.halfDimension.x * 0.5,
                                                                                   this.halfDimension.y * 0.5,
                                                                                   this.halfDimension.z * 0.5));
                }
                this.children[this.getOctantContainingPoint(oldPoint.getPosition())].insert(oldPoint);
                this.children[this.getOctantContainingPoint(point.getPosition())].insert(point);
            }
        } else {
            // console.log("else");
            var octant = this.getOctantContainingPoint(point.getPosition());
            this.children[octant].insert(point);
        }
    }

    renderData() {
        if (!this.rendering) {
            this.addBox(this.origin, this.halfDimension);
            this.rendering = true;
        }
        if (this.children[0] != null) {

            for (var i = 0; i < 8; i++) {
                this.children[i].renderData();
            }
        }
    }

    addBox(origin, halfDimension) {
        var geometry = new THREE.BoxGeometry(halfDimension.x * 2, 
                                             halfDimension.y * 2, 
                                             halfDimension.z * 2);
        var obj = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(0xff0000));
        var box = new THREE.BoxHelper(obj, 0x932382);
        box.position.set(origin.x, origin.y, origin.z);

        scene.add(box);
    }

    getPointsInsideBox(bMin, bMax, arr) {
        if (this.isLeaf()) {
            if (this.data != null) {
                var p = this.data.getPosition();
                if (p.x > bMax.x || p.y > bMax.y || p.z > bMax.z)
                    return;
                if (p.x < bMin.x || p.y < bMin.y || p.z < bMin.z)
                    return;
                arr[arr.length] = this.data;
            }
        } else {
            for (var i = 0; i < 8; i++) {
                var cMax = new THREE.Vector3(this.children[i].origin.x + this.children[i].halfDimension.x,
                                             this.children[i].origin.y + this.children[i].halfDimension.y,
                                             this.children[i].origin.z + this.children[i].halfDimension.z);
                var cMin = new THREE.Vector3(this.children[i].origin.x - this.children[i].halfDimension.x,
                                             this.children[i].origin.y - this.children[i].halfDimension.y,
                                             this.children[i].origin.z - this.children[i].halfDimension.z);

                if (cMax.x < bMin.x || cMax.y < bMin.y || cMax.z < bMin.z)
                    continue;
                if (cMin.x > bMax.x || cMin.y > bMax.y || cMin.z > bMax.z)
                    continue;

                this.children[i].getPointsInsideBox(bMin, bMax, arr);
            }
        }
    }
}

function randVec(width) {
    return new THREE.Vector3(Math.random()*width - width/2, 
                             Math.random()*width - width/2, 
                             Math.random()*width - width/2);
}

var octRoot = new OctreeNode(new THREE.Vector3(0, 0, 0), new THREE.Vector3(200, 200, 200));

for (var i = 0; i < 1000; i++) {
}


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

var count = 0;
function lineVec(count) {
    return new THREE.Vector3(100*Math.sin(0.0174533 * count), 0.5*count-200, 100*Math.cos(0.0174533 * count))
}

function render(){
    stats.begin();
    if (count > 200) {
        var point = randVec(200);
        var point = lineVec(count);

        var geometry = new THREE.BoxGeometry(2, 2, 2);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(point.x, point.y, point.z);

        scene.add(cube);
        octRoot.insert(new OctreePoint(null, point));

        octRoot.renderData();
    }

    console.log(count++);

    stats.end();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();