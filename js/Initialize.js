/*
	Developed my Marc Lytle 2018
*/
    var container, controls, model;
    var fileName, fileExt, path;
    var camera, scene, renderer, light, raycaster, mouse;
    // var skyColor = 0xbbbbff;
    // var groundColor = 0x444422;
    var skyColor = 0xffffff;
    var groundColor = 0xffffff;


    

    function loadModelOntoPage(model) {
        modelType = model.split('.').pop();
        if (model.includes('/') || model.includes('\\')) {
            var fullFileName = model.split('\\').pop().split('/').pop();
            path = model.replace(fullFileName, '');
            fileExt = fullFileName.split('.').pop();
            fileName = fullFileName.replace('.' + fileExt, '');

        } else {
            path = '';
            fileExt = model.split('.').pop();
            fileName = model.replace('.' + fileExt, '');

        }
        init();
        animate();
    }



    


    function init() {

        // getting the container
        // container = document.createElement('div');
        container = document.getElementById( 'canvas' );
        document.body.appendChild( container );

        // setting up the camera - this posistion just looks a little better to me
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 50);
        // camera.position.set(0, 0, 50);
        camera.position.set(-5, 25, 20);

        // setting the scene
        scene = new THREE.Scene();
        var color = new THREE.Color('white');
        scene.background = color;

        // adding a general ambient light 
        light = new THREE.HemisphereLight(skyColor, groundColor);
        light.position.set(0, 1, 0);
        scene.add(light);


        // checking for the type of file... should be gone when a file type
        // is known 
        if (fileExt == 'gltf' ||  fileExt == 'glb') {
            var mypro = loadGltfModel(path + fileName + "." +fileExt);
            mypro.then(myObj => {
                model = myObj;
                scene.add(myObj.scene);
            }).catch(error => {
                console.error(error)
            });
        } else if (fileExt == 'obj') {
            var mypro = loadObjModel(path, fileName);
            mypro.then(myObj => {
                model = myObj;
                model.rotation.x = -Math.PI / 2;
                scene.add(myObj);
                // setTimeout(function(){
                //     littleHop(model);
                // },100);
                
            }).catch(error => {
                console.error(error)
            });

        }

        // adding raycaster and mouse for comparing mouse actions to object posistions
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();



        // ading the orbit controls - pan and zoom
        controls = new THREE.OrbitControls(camera);
        controls.target.set(0, 5, 0);
        // the max and min zoom here
        controls.maxDistance = 40;
        controls.minDistance = 10;
        controls.update();

        //set renderer
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.gammaOutput = true;
        container.appendChild(renderer.domElement);
    }

    window.addEventListener('resize', onWindowResize, false);



// adjusting to changes in the window
function onWindowResize() {

    // camera.aspect = window.innerWidth / window.innerHeight;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);

}

// actually animating the scene including orbit changes

function animate() {


    requestAnimationFrame(animate);

    raycaster.setFromCamera( mouse, camera);

    var intersects = raycaster.intersectObjects( scene.children);
    if (intersects.lenght > 0 ) {
        littleHop(intersects[0]);
    }

    renderer.render(scene, camera);

}

// function to register mouse location on click
function onMouseDown( event) {
    mouse.x = (event.clientX / window.innerWidth) *2 -1;
    mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
}


// function to load the obj model - this is a two part load - it takes
// relative path and for now just the basename of the files (ie you have
// a 'model.obj', and the accompanying 'model.mtl', pass the the path and 
// 'model' to the function. 
function loadObjModel(path, name) {

    var progress; // = console.log;

    return new Promise(function (resolve, reject) {
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(path);
        mtlLoader.load(name + ".mtl", function (materials) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials);
            objLoader.setPath(path);
            objLoader.load(name + ".obj", resolve, progress, reject);

        }, progress, reject);
    });
}

// function to load gltf model - this just takes the filename with the
// gltf extension. That file will point to relative adjacent needed for 
// materials etc.
function loadGltfModel(name) {
    var progress = console.log;

    return new Promise(function (resolve, reject) {
        var gltfLoader = new THREE.GLTFLoader();
        // gltfLoader.setPath(path);
        gltfLoader.load(name, resolve, progress, reject);
    });
}

//ugle function to test interaction
function causeHop(){
    littleHop(model);
}

// ugly function to animate hop
function littleHop(model){
    var id = setInterval(frame, 10);
    var progress = 0;
    function frame() {
        if (progress >= 80){
            clearInterval(id);
        } else if (progress < 10){
            progress++;
            model.position.y += 0.1;
            model.rotation.y -=0.01;
        } else if (progress < 20){
            progress++;
            model.position.y += 0.1;
            model.rotation.y +=0.01;
        } else if (progress < 30){
            progress++;
            model.position.y -=0.1;
            model.rotation.y +=0.01;
        } else if (progress < 40) {
            progress++;
            model.position.y -= 0.1;
            model.rotation.y -=0.01;
        }else if (progress < 50){
            progress++;
            model.position.y += 0.1;
            model.rotation.y -=0.01;
        } else if (progress < 60){
            progress++;
            model.position.y += 0.1;
            model.rotation.y +=0.01;
        } else if (progress < 70){
            progress++;
            model.position.y -=0.1;
            model.rotation.y +=0.01;
        } else if (progress < 80) {
            progress++;
            model.position.y -= 0.1;
            model.rotation.y -=0.01;
        }
    }
}
