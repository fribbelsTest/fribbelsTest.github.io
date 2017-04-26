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
        this.boxHelper = null;
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

    delete(point) {
        if (this.isLeaf()) {
            if (this.data == null) {
                
            } else {
                if (this.data.position == point.position) {
                    console.log("DELETED");
                    this.data = null;
                    this.rendering = false;
                    return true;
                }
            }
        } else {
            var octant = this.getOctantContainingPoint(point.getPosition());
            this.children[octant].delete(point);
        }
        return false;
    }

    insert(point) {
        if (this.isLeaf()) {
            if (this.data == null) {
                this.data = point;
            } else {
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
            var octant = this.getOctantContainingPoint(point.getPosition());
            this.children[octant].insert(point);
        }
    }

    clearRender() {
        scene.remove(this.boxHelper);
        if (this.children[0] != null) {
            for (var i = 0; i < 8; i++) {
                this.children[i].clearRender();
            }
        }
        if (this.rendering) {
            this.boxHelper = null;
            this.rendering = false;
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

        this.boxHelper = box;
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