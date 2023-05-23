
//variables 
var TREES_COUNT = 10; //number of trees\

//criar um muro
function createwall(){

    //criar o muro
    var wall = new THREE.Mesh(
        new THREE.BoxGeometry(40,15,5),
        new THREE.MeshPhongMaterial( { color: 0x808080, shading: THREE.FlatShading } )
        );
        //wall.rotation.x = - Math.PI / 2;
        wall.castShadow = true;
        wall.receiveShadow = true;
       
        return wall;
}



function createScoreboard() {
    var board = new THREE.Object3D();
    
    //fazer o ecrã
    var screen = new THREE.Mesh(
        new THREE.BoxGeometry(15,9,1),
        new THREE.MeshPhongMaterial( { color: 0x808080, shading: THREE.FlatShading } )
        );

    //fazer o suporte do ecra
    var bottum = new THREE.Mesh(
    new THREE.BoxGeometry(5,20,1),
    new THREE.MeshPhongMaterial( { color: 'black', shading: THREE.FlatShading } )
    );
    
    //criar os pontos para por no ecrã
    var p1 = new THREE.Mesh(
        new THREE.BoxGeometry(4,7,0.5),
        new THREE.MeshPhongMaterial( { color: 'red', shading: THREE.FlatShading } )
        );
        p1.position.set(-15, 5, 5);
        var p2 = new THREE.Mesh(
            new THREE.BoxGeometry(4,7,0.5),
            new THREE.MeshPhongMaterial( { color: 'red', shading: THREE.FlatShading } )
        );
        p2.position.set(15, 5, 5);
        var p3 = new THREE.Mesh(
            new THREE.BoxGeometry(4,7,0.5),
            new THREE.MeshPhongMaterial( { color: 'red', shading: THREE.FlatShading } )
            );
            p3.position.set(15, 5, -15);

  

    screen.rotation.y = 50;

    bottum.position.y = -9;
    bottum.position.z = 2;
    bottum.position.x = 0;

    p1.position.y = -1;
    p1.position.z = -1;
    p1.position.x = 5;

    p1.rotation.y = 50;

    p2.position.y = -1;
    p2.position.z = -2.5;
    p2.position.x = 0.8;

    p2.rotation.y = 50;
   

    p3.position.y = -0.6;
    p3.position.z = -2.8;
    p3.position.x = -4;

    p3.rotation.y = 50;
   
    //adicionar os elementos
    board.add(screen);
    board.add(bottum);
    board.add(p1);
    board.add(p2);
    board.add(p3);


    // retorna o placar
    return board;
}

function createTargetStructure() {
    // cria o objeto da estrutura
    var structure = new THREE.Object3D();

    // cria a geometria dos paus
    var stickGeometry = new THREE.CylinderGeometry(0.4,0.4,12);
    var stickMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });

    // cria os paus e os posiciona
    var stick1 = new THREE.Mesh(stickGeometry, stickMaterial);
    stick1.position.set(3, 0, -15);
    structure.add(stick1);

    var stick2 = new THREE.Mesh(stickGeometry, stickMaterial);
    stick2.position.set(-3, 0, -15);
    structure.add(stick2);

    var stick3 = new THREE.Mesh(stickGeometry, stickMaterial);
    stick3.position.set(0, 8.5, -9);
    structure.add(stick3);

    stick3.rotation.z = 190;

    // cria o alvo e o posiciona
    var target = createTarget();
    target.position.set(0, 3.9, -15);
    target.rotation.z = 53.5;
    structure.add(target);

    // retorna a estrutura completa
    return structure;
}


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
        new THREE.ConeGeometry(2, 3, 9),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    var leaves1 = new THREE.Mesh(
        new THREE.ConeGeometry(2, 4, 8),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    var leaves2 = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 2, 8),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    //sets the position of the leaves
    leaves.position.y = 4;
    leaves1.position.y = 3;
    leaves2.position.y = 5;
    //adds the trunk and leaves to the tree
    tree.add(trunk);
    tree.add(leaves);
    tree.add(leaves1);
    tree.add(leaves2);
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

function Set (){
    //creates the stand
    var stand = new THREE.Object3D();
    //creates the stand geometry
    var standGeometry = new THREE.Cubegeometry(.1, .1, 3, 8, 8);
}


//function to add the models and objects to the scene
function ambientCreation () {
    
    meshes["wall"] = createwall();
    meshes["wall"].position.set(5, 0, 30);
    scene.add(meshes["wall"]);

    meshes["scoreboard"] = createScoreboard();
    meshes["scoreboard"].position.set(-15, 19, 30);
    scene.add(meshes["scoreboard"]);

     // cria a estrutura de madeira com o alvo preso
     meshes["targetStructure"] = createTargetStructure();
     meshes["targetStructure"].position.set(0, 0, 20);
     scene.add(meshes["targetStructure"]);
 

    //creates the bow 
    meshes["bow"] = models.bow.mesh.clone(); //clones the bow mesh
    //for loop to create the trees
    for (var i = 0; i < TREES_COUNT; i++) {
        meshes["tree" + i] = createTree(); //creates a tree
    }
    //creates the target
    meshes["target"] = createTarget(); //creates a target  
    
    //position aand scale the bow
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


    for (var i = 0; i < TREES_COUNT; i++) {
        meshes["target" + i] = createTarget(); //creates a tree
    }
    //position the target and add it to the scene
    meshes["target"].position.set(-2.5, 1.7, 3);
    scene.add(meshes["target"]);

    meshes["target1"].position.set(2.5, 1.7, 0);
    scene.add(meshes["target1"]);




}
