var scene, camera, renderer, mesh, clock; //creates the scene, camera, renderer, mesh and clock variables
var meshFloor, ambientLight, light; //creates the meshFloor, ambientLight and light variables
const GRAVITY = 0.01; //creates the gravity variable

var keyboard = {}; //creates the keyboard variable
var player = { height:1.8, speed:0.05, turnSpeed:Math.PI*0.0075, canShoot:0 }; //creates the player variable
var USE_WIREFRAME = false; //creates the USE_WIREFRAME variable to use in the button


//--------------------------LOADING SCREEN--------------------------
//creates the loading screen variables
var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(90, 1280/720, 0.1, 100),
    box: new THREE.Mesh(
        new THREE.BoxGeometry(0.5,0.5,0.5),
        new THREE.MeshBasicMaterial({ color:0x4444ff })
    )
};

var loadingManager = null; //creates the loadingManager variable
var RESOURCES_LOADED = false; //creates the RESOURCES_LOADED variable



//--------------------------MODELS--------------------------
//models is an object that contains all the models that will be used in the game
var models = {
    bow: { //creates the weapon object
        obj:"models/bow_01.obj",
        mtl:"models/bow_01.mtl",
        mesh: null,
        castShadow:false
    },
    arrow: { //creates the arrow object
        obj:"models/arrow.obj",
        mtl:"models/arrow.mtl",
        mesh: null,
        castShadow:false
    }
};



var meshes = {}; //creates the meshes variable

var arrows = []; //creates the arrows array


function instructions() {
    document.getElementById("startGame").style.display = "none";
    document.getElementById("instructions").style.display = "none";
    document.getElementById("divInstructions").style.display = "block";
    document.getElementById("back").style.display = "block";
}

function back() {
    //refresh the page
    window.location.reload();
}


//initializes the game and calls the animate function
//--------------------------INIT--------------------------
function init() {
    document.getElementById("startGame").style.display = "none";
    document.getElementById("scoreboard").style.display = "block";
    document.getElementById("instructions").style.display = "none";
    scene = new THREE.Scene(); //initializes the scene
    camera = new THREE.PerspectiveCamera( 90, 1280/720, 0.1, 1000 ); //initializes the camera with a 90 degree field of view, a 1280/720 aspect ratio, a 0.1 near plane and a 1000 far plane
    clock = new THREE.Clock(); //initializes the clock variable to use in the animate function

    loadingScreen.box.position.set(0,0,5); //sets the position of the loading screen box
    loadingScreen.camera.lookAt(loadingScreen.box.position); //makes the camera look at the loading screen box
    loadingScreen.scene.add(loadingScreen.box); //adds the loading screen box to the loading screen scene

    loadingManager = new THREE.LoadingManager(); //initializes the loadingManager variable
    loadingManager.onProgress = function(item, loaded, total){ //creates the loadingManager.onProgress function
        console.log(item, loaded, total); //logs the item, loaded and total variables to see the progress of the loading
    }; 

    loadingManager.onLoad = function(){ //creates the loadingManager.onLoad function
        console.log("loaded all resources"); //logs that all the resources have been loaded
        RESOURCES_LOADED = true; //sets the RESOURCES_LOADED variable to true
        onResourcesLoaded(); //calls the onResourcesLoaded function
    };




    //--------------------------FLOOR--------------------------
    //creates the floor
    meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry( 60, 60, 10, 10 ), //creates a plane with a width of 20, a height of 20, 10 segments on the width and 10 segments on the height
        new THREE.MeshPhongMaterial( { color: 0xffffff, wireframe:USE_WIREFRAME } ) //creates a new MeshPhongMaterial with a white color and the USE_WIREFRAME variable
    );
    //adds a texture to the floor
    var TextureLoader = new THREE.TextureLoader();
    meshFloor.material.map = TextureLoader.load("textures/grass.jpg");
    meshFloor.material.map.wrapS = THREE.RepeatWrapping;
    meshFloor.material.map.wrapT = THREE.RepeatWrapping;
    meshFloor.material.map.repeat.set( 10, 10 );
    
    meshFloor.rotation.x -= Math.PI / 2; //rotates the meshFloor 90 degrees on the x axis
    meshFloor.receiveShadow = true; //makes the meshFloor receive shadows
    scene.add( meshFloor ); //adds the meshFloor to the scene

    //---------------------------SKYBOX---------------------------
   // Crie uma esfera com um raio grande o suficiente para envolver todo o ambiente
    var geometry = new THREE.SphereGeometry(500, 60, 40);

    // Inverta as faces da esfera para que a textura apareça do lado correto
    geometry.scale(-1, 1, 1);

    // Carregue a imagem panorâmica em 360 graus como textura
    var texture = new THREE.TextureLoader().load('./textures/skybox.jpg');

    // Mapeie a textura na esfera
    var material = new THREE.MeshBasicMaterial({ map: texture });

    // Crie uma malha com a geometria e o material
    var mesh = new THREE.Mesh(geometry, material);

    // Adicione a malha à cena
    scene.add(mesh);


    //--------------------------LIGHT--------------------------
    ambientLight = new THREE.AmbientLight( 0xffffff, 0.2 );  //creates a new AmbientLight with a white color and a 0.2 intensity
    scene.add( ambientLight ); //adds the ambientLight to the scene

    light = new THREE.PointLight( 0xffffff, 0.8, 18 ); //creates a new PointLight with a white color, a 0.8 intensity and a distance of 18
    light.position.set( -3, 6, -3 ); //sets the position of the light
    light.castShadow = true; //makes the light cast shadows
    light.shadow.camera.near = 0.1; //sets the near plane of the light's shadow camera to 0.1
    light.shadow.camera.far = 25; //sets the far plane of the light's shadow camera to 25
    scene.add( light ); //adds the light to the scene


    //for loop through the models complex object to shadow every single simple object
    for( var _key in models ){ //loops through the models object
		(function(key){ //creates a function with the key variable
			
			var mtlLoader = new THREE.MTLLoader(loadingManager); //creates a new MTLLoader with the loadingManager variable
			mtlLoader.load(models[key].mtl, function(materials){ //loads the material of the model
				materials.preload(); //preloads the material
				
				var objLoader = new THREE.OBJLoader(loadingManager); //creates a new OBJLoader with the loadingManager variable
				
				objLoader.setMaterials(materials); //sets the materials of the model
				objLoader.load(models[key].obj, function(mesh){ //loads the model
					
					mesh.traverse(function(node){ //traverses through the model
						if( node instanceof THREE.Mesh ){ //checks if the node is a mesh
                            if('castShadow' in models[key])  //checks if the model has a castShadow property
                                node.castShadow = models[key].castShadow;
                            else
                            node.castShadow = true;
                            if('receiveShadow' in models[key]) //checks if the model has a receiveShadow property
                                node.receiveShadow = models[key].receiveShadow;
                            else
							node.receiveShadow = true;
						}
					});
					models[key].mesh = mesh; //sets the mesh of the model
					
				});
			});
			
		})(_key); 
	}
    
    //--------------------------CAMERA--------------------------
    camera.position.set( 0, player.height, -5 ); //sets the position of the camera
    camera.lookAt( new THREE.Vector3( 0, player.height, 0 ) ); //makes the camera look at the center of the scene


    //--------------------------RENDERER--------------------------
    renderer = new THREE.WebGLRenderer(); //initializes the renderer
    renderer.setSize( 1280, 720 ); //sets the size of the renderer
    renderer.shadowMap.enabled = true; //enables shadows
    renderer.shadowMap.type = THREE.BasicShadowMap; //sets the type of the shadows

    document.body.appendChild( renderer.domElement ); //adds the renderer to the body of the html document


    //--------------------------CROSSHAIR--------------------------
    //draw a crosshair on the center of the screen
    var crosshair = new THREE.Mesh(
        new THREE.RingGeometry( 0.02, 0.04, 32 ),
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } )
    );
    crosshair.position.z = -2;
    camera.add( crosshair ); //adds the crosshair to the camera
    scene.add( camera ); //adds the camera to the scene
    

    animate(); //calls the animate function
}
//--------------------------END OF INIT--------------------------


//function to add the meshes to the scene
function onResourcesLoaded(){
    ambientCreation(); //calls the ambientCreation function
}

//function to animate the scene
//--------------------------ANIMATE--------------------------
function animate() {
    //if the resources are not loaded, shows the loading screen
    if( RESOURCES_LOADED == false ){
        requestAnimationFrame( animate ); 

        loadingScreen.box.position.x -= 0.05; //moves the box to the left
        if( loadingScreen.box.position.x < -10 ) loadingScreen.box.position.x = 10; //if the box is out of the screen, moves it to the right
        loadingScreen.box.position.y = Math.sin( loadingScreen.box.position.x ); //moves the box up and down


        renderer.render(loadingScreen.scene, loadingScreen.camera); //renders the loading screen
        return; //stops the function
    }
    requestAnimationFrame( animate );

    var time = Date.now() * 0.0005; //sets the time
    var delta = clock.getDelta(); //sets the delta




    //--------------------------MOVEMENT--------------------------
    if ( keyboard[87] ) { // w key
        camera.position.x -= Math.sin( camera.rotation.y ) * player.speed;
        camera.position.z -= -Math.cos( camera.rotation.y ) * player.speed;
    }

    if ( keyboard[83] ) { // s key
        camera.position.x += Math.sin( camera.rotation.y ) * player.speed;
        camera.position.z += -Math.cos( camera.rotation.y ) * player.speed;
    }

    if ( keyboard[65] ) { // a key
        camera.position.x += Math.sin( camera.rotation.y + Math.PI / 2 ) * player.speed;
        camera.position.z += -Math.cos( camera.rotation.y + Math.PI / 2 ) * player.speed;
    }

    if ( keyboard[68] ) { // d key
        camera.position.x += Math.sin( camera.rotation.y - Math.PI / 2 ) * player.speed;
        camera.position.z += -Math.cos( camera.rotation.y - Math.PI / 2 ) * player.speed;   
    }




    //--------------------------CAMERA MOVEMENT--------------------------

    if ( keyboard[37] ) { // Left arrow key
        camera.rotation.y -= player.turnSpeed;
    }

    if ( keyboard[39] ) { // Right arrow key´
        camera.rotation.y += player.turnSpeed;
    }


      




    //--------------------------ARROW SHOOTING--------------------------

    //for loop to add the arrows to the arrows array
    for (var index=0; index<arrows.length; index+=1){
        if (arrows[index] === undefined) continue;
        if (arrows[index].alive = false){ //if it is not alive, removes it from the array
            arrows.splice(index,1); //removes the arrow from the array
            continue;
        }
        //checks if the arrow collides with the target (not working properly)
        arrowCollider = new THREE.Box3().setFromObject(arrows[index]); //creates a collider for the arrow
        targetCollider = new THREE.Box3().setFromObject(meshes["target"]); //creates a collider for the target
        if (arrowCollider.intersectsBox(targetCollider)){ //if the arrow collides with the target
            console.log("hit"); //prints hit
            arrows[index].alive = false; //sets the arrow to not alive
        }
        arrows[index].position.add(arrows[index].velocity); //moves the arrow
        //applys gravity to the arrow
        arrows[index].velocity.y -= 0.0025;
    }
    document.addEventListener("mousedown", function (event){
        if ( event.button === 0 && player.canShoot <= 0) { // space key
            //creates a arrow
            var arrow = new THREE.Mesh( 
                new THREE.CylinderGeometry(0.05,0.2, 8), //creates a sphere to make the arrow
                new THREE.MeshBasicMaterial( {color: 0xffffff} ) //sets the color of the arrow
            );
    
            //rotate the arrow to make it go in the right direction
            arrow.rotation.set(
                camera.rotation.x,
                camera.rotation.y - Math.PI / 2,
                camera.rotation.z - Math.PI / 2
            )
    
            arrow.position.set( //sets the position of the arrow (near the weapon)
                meshes["bow"].position.x, //x position of the weapon
                meshes["bow"].position.y + 0.05, //y position of the weapon (a little bit higher than the weapon)
                meshes["bow"].position.z //z position of the weapon
            );
    
            arrow.velocity = new THREE.Vector3( //sets the velocity of the arrow
                -Math.sin(camera.rotation.y), //x velocity of the arrow
                0, //y velocity of the arrow (it's affected by gravity later)
                Math.cos(camera.rotation.y) //z velocity of the arrow
            );
    
            arrow.alive = true; //sets the arrow to alive

            //function to kill the arrow after 1000ms
            setTimeout(function(){
                arrow.alive = false;
                scene.remove(arrow);
            }, 1000);
    
            arrows.push(arrow); //adds the arrow to the arrows array
    
            scene.add(arrow); //adds the arrow to the scene
            player.canShoot = 20; //every x frames the player can shoot
        } 
        if (player.canShoot > 0) player.canShoot -= 1; //decreases the canShoot variable every frame (so the player can shoot again after a while)
    })
    

    meshes["bow"].position.set( //sets the position of the weapon
        camera.position.x - Math.sin(camera.rotation.y + Math.PI/4) * 0.75,
        camera.position.y - 0.5 + Math.sin(time*4 + camera.position.x + camera.position.z) * 0.01,
        camera.position.z + Math.cos(camera.rotation.y + Math.PI/4) * 0.75
    );

    meshes["bow"].rotation.set( //sets the rotation of the weapon
        camera.rotation.x,
        camera.rotation.y,
        camera.rotation.z 
    );

    renderer.render( scene, camera ); //renders the scene
}

function keyDown(event) { //function to check if a key is pressed
    keyboard[event.keyCode] = true;
}

function keyUp(event) { //function to check if a key is released
    keyboard[event.keyCode] = false;
}



window.addEventListener( 'keydown', keyDown); //adds the keydown event listener
window.addEventListener( 'keyup', keyUp); //adds the keyup event listener

//window.onload = init; //when the window loads, calls the init function