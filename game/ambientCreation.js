//variables 
var TREES_COUNT = 10; //number of trees\

//creates a tree 
function createTree() {
    //creates a tree
    var tree = new THREE.Object3D();
    //creates a cylinder
    var trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 5, 8, 8),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    //creates a sphere
    var leaves = new THREE.Mesh(
        new THREE.SphereGeometry(3, 8, 8),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    //sets the position of the leaves
    leaves.position.y = 4;
    //adds the trunk and leaves to the tree
    tree.add(trunk);
    tree.add(leaves);
    //returns the tree
    return tree;    
}

//creates a target to shoot at
function createTarget() {
    //creates a target
    var target = new THREE.Object3D();
    //creates the inner circle of the target (25 points)
    var targetCircle = new THREE.Mesh( 
        new THREE.CircleGeometry(1, 8),
        new THREE.MeshLambertMaterial({color: 0xffff00})
    );
    //creates the outer circle of the target (10 points)
    var targetCircle2 = new THREE.Mesh(
        new THREE.CircleGeometry(1.5, 8),
        new THREE.MeshLambertMaterial({color: 0xffffff})
    );
    //creates the center circle of the target (50 points)
    var targetCircle3 = new THREE.Mesh(
        new THREE.CircleGeometry(.5, 8),
        new THREE.MeshLambertMaterial({color: 0xff0000})
    );
    //creates to cylinders to be the target stand
    var targetStand1 = new THREE.Mesh(
        new THREE.CylinderGeometry(.1, .1, 3, 8, 8),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    var targetStand2 = new THREE.Mesh(
        new THREE.CylinderGeometry(.1, .1, 3, 8, 8),
        new THREE.MeshLambertMaterial({color: 0x8B4513})
    );
    //sets the position of the target stand
    //stand 1
    targetStand1.position.y = -.5;
    targetStand1.position.x = -.5;
    targetStand1.position.z = -.2;
    //stand 2
    targetStand2.position.y = -.5;
    targetStand2.position.x = .5;
    targetStand2.position.z = -.2;
    //sets the position of the target circles
    targetCircle2.position.z = -.01;
    targetCircle3.position.z = .01;
    //adds the target stand and target circle to the target
    target.add(targetStand1);
    target.add(targetStand2);
    target.add(targetCircle);
    target.add(targetCircle2);	
    target.add(targetCircle3);
    //rotates the target
    target.rotation.set(0, Math.PI, 0);
    //returns the target
    return target;
}



//function to add the models and objects to the scene
function ambientCreation () {
    //creates the bow 
    meshes["bow"] = models.bow.mesh.clone(); //clones the bow mesh
    //for loop to create the trees
    for (var i = 0; i < TREES_COUNT; i++) {
        meshes["tree" + i] = createTree(); //creates a tree
    }
    //creates the target
    meshes["target"] = createTarget(); //creates a target

    //position and scale the bow
    meshes["bow"].position.set(0,2,0);
    meshes["bow"].scale.set(.3,.3,.3);
    //add the bow to the scene
    scene.add(meshes["bow"]);

    //position the array of trees 
    meshes["tree0"].position.set(5, 0, 0);
    meshes["tree1"].position.set(-5, 0, 0);
    meshes["tree2"].position.set(-15, 0, 5);
    meshes["tree3"].position.set(15, 0, -5);
    meshes["tree4"].position.set(5, 0, 5);
    meshes["tree5"].position.set(-5, 0, -5);
    meshes["tree6"].position.set(5, 0, -5);
    meshes["tree7"].position.set(-5, 0, 5);
    meshes["tree8"].position.set(-10, 0, 10);
    meshes["tree9"].position.set(10, 0, -10);
    //for loop to add the trees to the scene
    for (var i = 0; i < TREES_COUNT; i++) {
        scene.add(meshes["tree" + i]);
    }
    //position the target and add it to the scene
    meshes["target"].position.set(0, 1.7, 0);
    scene.add(meshes["target"]);
}