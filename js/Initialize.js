/*
	Developed my Marc Lytle 2018
*/
var container, controls, model;
var fileName, fileExt, path;
var camera, scene, renderer, light, light3, raycaster, mouse, plane, print;
var sphereGeometry, planeGeometry;
var rotationDone = false;
var keepAnimating = true;
var floatProgress = 0;
// var skyColor = 0xbbbbff;
// var groundColor = 0x444422;
var skyColor = 0xffffff;
var groundColor = 0xffffff;
var connectingElement = 'canvas';
var cameraDistance = 500;
var shadowPrint;
var objFile;
var mtlFile;


function loadModelOntoPage(jsonObject) {
    shadowPrint = jsonObject.files[2].shadow;
    objFile = jsonObject.files[0].obj;
    mtlFile = jsonObject.files[1].mtl;
    console.log(mtlFile);


    init();
    animate();
}




// function loadModelOntoPage(model,material, shadow) {
//     shadowPrint = shadow;
//     modelType = model.split('.').pop();
//     if (model.includes('/') || model.includes('\\')) {
//         var fullFileName = model.split('\\').pop().split('/').pop();
//         path = model.replace(fullFileName, '');
//         fileExt = fullFileName.split('.').pop();
//         fileName = fullFileName.replace('.' + fileExt, '');

//     } else {
//         path = '';
//         fileExt = model.split('.').pop();
//         fileName = model.replace('.' + fileExt, '');

//     }
//     init();
//     animate();
// }






function init() {

    // getting the container
    // container = document.createElement('div');
    container = document.getElementById(connectingElement);
    document.body.appendChild(container);

    // setting up the camera - this position just looks a little better to me
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 50);
    camera.position.set(0, 0, cameraDistance);
    // camera.position.set(-5, 25, 20);

    // setting the scene
    scene = new THREE.Scene();
    var color = new THREE.Color(0xdddddd);
    scene.background = color;

    light = new THREE.AmbientLight(skyColor);
    light.position.set(0, 10, 0);
    scene.add(light)

    var modelLoading = loadObjectModel(objFile, mtlFile);
    modelLoading.then(result => {
        model = result;
        model.rotation.y = Math.PI / 2;
        model.scale.x = 0.30;
        model.scale.y = 0.30;
        model.scale.z = 0.30;
        scene.add(result);
        scene.add(print);
        modelLoaded = true;
        setTimeout(function () {
            rotateOnce(model);
        }, 100);

    }).catch(error => {
        console.error(error)
    });



    // checking for the type of file... should be gone when a file type
    // is known 
    // if (fileExt == 'gltf' || fileExt == 'glb') {
    //     var mypro = loadGltfModel(path + fileName + "." + fileExt);
    //     mypro.then(myObj => {
    //         model = myObj;
    //         scene.add(myObj.scene);
    //     }).catch(error => {
    //         console.error(error)
    //     });
    // } else if (fileExt == 'obj') {
    //     var mypro = loadObjModel(path, fileName);
    //     mypro.then(myObj => {
    //         model = myObj;
    //         model.rotation.y = Math.PI / 2;
    //         // model.position.y = 2;
    //         model.scale.x = 0.30;
    //         model.scale.y = 0.30;
    //         model.scale.z = 0.30;
    //         scene.add(myObj);
    //         scene.add(print);
    //         modelLoaded = true;
    //         setTimeout(function () {
    //             // littleHop(model);

    //             rotateOnce(model);
    //         }, 100);

    //     }).catch(error => {
    //         console.error(error)
    //     });

    // } else if (fileExt == "drc") {
    //     // var mtlProgress = console.log;
    //     // var drcProgress = console.log;
    //     // var mtlLoader = new THREE.MTLLoader();
    //     // mtlLoader.setPath(path);
    //     // var mtlPromise = mtlLoader.load(fileName + ".mtl", res =>{
    //     //     console.log(res);
    //     // }, mtlProgress, rej => {
    //     //     confirm.error(rej);
    //     // });

    //     // THREE.DRACOLoader.setDecoderPath('js/');
    //     // THREE.DRACOLoader.setDecoderConfig({type: 'js'});
    //     // var dracoLoader = new THREE.DRACOLoader();
    //     // var drcPromise = dracoLoader.load(path + fileName + ".drc",  res =>{
    //     //     console.log(res);
    //     // }, drcProgress,  res =>{
    //     //     console.log(res);
    //     // });

    //     // Promise.all([drcPromise, mtlPromise]).then(function(values) {
    //     //     console.log(values[0]);
    //     //     console.log(values[1]);
    //     //   });






    //     console.log("in drc");
    //     var mypro = loadDRACOModel(path, fileName);
    //     console.log(mypro);
    //     mypro.then(myObj => {
    //         console.log("then");
    //         console.log(myObj);
    //         myObj.computeVertexNormals();
    //         var material = new THREE.MeshStandardMaterial({
    //             color: 0xff0000
    //         });
    //         var mesh = new THREE.Mesh(myObj, material);
    //         mesh.scale.x = 0.3;
    //         mesh.scale.y = 0.3;
    //         mesh.scale.z = 0.3;
    //         mesh.castShadow = true;
    //         mesh.receiveShadow = true;
    //         scene.add(mesh);
    //         // model = myObj;
    //         // scene.add(model);
    //         // modelLoaded = true;
    //         // setTimeout(() =>{
    //         //     rotateOnce(model);
    //         // },100);
    //     }).catch(error => {
    //         console.log(error);
    //     });

    // }






    // Create a texture loader so we can load our image file
    var loader = new THREE.TextureLoader();

    // Load an image file into a custom material
    var material = new THREE.MeshLambertMaterial({
        map: loader.load(shadowPrint)
    });

    material.transparent = true;

    // create a plane geometry for the image with a width of 10
    // and a height that preserves the image's aspect ratio
    var geometry = new THREE.PlaneGeometry(10, 20);

    // combine our image geometry and material into a mesh
    print = new THREE.Mesh(geometry, material);

    // set the position of the image mesh in the x,y,z dimensions
    print.position.set(0, -2, 0)
    print.rotation.x = (Math.PI / 2) * 3;
    print.rotation.z = (Math.PI / 2);

    // add the image to the scene
    // scene.add(print);

    // adding raycaster and mouse for comparing mouse actions to object posistions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();



    // ading the orbit controls - pan and zoom
    controls = new THREE.OrbitControls(camera, document.getElementById(connectingElement));
    controls.target.set(0, 5, 0);
    // the max and min zoom here
    controls.maxDistance = 40;
    controls.minDistance = 10;
    controls.update();

    //set renderer
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);
}

window.addEventListener('resize', onWindowResize, false);

window.addEventListener('mousedown', onMouseDown, false);



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

    // // update the picking ray with the camera and mouse position
    // raycaster.setFromCamera( mouse, camera );

    // // calculate objects intersecting the picking ray
    // var intersects = raycaster.intersectObjects( scene.children , true);
    // console.log(intersects[0]);
    // for ( var i = 0; i < intersects.length; i++ ) {

    //     // intersects[ i ].object.material.color.set( 0xff0000 );
    //     console.log(intersects[i]);

    // }


    if (rotationDone & keepAnimating) {
        float();
    }

    renderer.render(scene, camera);

}

// function to register mouse location on click
function onMouseDown(event) {
    if (rotationDone) {
        keepAnimating = false;
        model.position.x = 0;
        model.position.y = 0;
        model.position.z = 0;
        scene.remove(print);
    }

    var rightMost = container.offsetLeft + container.clientWidth;
    if (event.clientX > container.offsetLeft & event.clientX < rightMost) {

        mouse.x = (((event.clientX - container.offsetLeft) / container.clientWidth));
        console.log(mouse.x);
    }
    var bottomMost = container.offsetTop + container.clientHeight;

    if (event.clientY > container.offsetTop & event.clientY < bottomMost) {
        mouse.y = (((container.clientHeight - (event.clientY - container.offsetTop)) / container.clientHeight));
        console.log(mouse.y);
    }

    //

    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    for (var i = 0; i < intersects.length; i++) {
        console.log(intersects[i]);
    }

    event.preventDefault();


}

function loadMaterials(path, name) {
    var progress; // = console.log;
    return new Promise((resolve, reject) => {
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(path);
        mtlLoader.load(name + ".mtl", resolve, progress, reject);
    });
}

function loadDRACOModelOnly(path, name) {

    var progress;// = console.log;

    return new Promise(function (resolve, reject) {

        THREE.DRACOLoader.setDecoderPath('js/');
        THREE.DRACOLoader.setDecoderConfig({type: 'js'});
        var dracoLoader = new THREE.DRACOLoader();
        dracoLoader.load(path + name + ".drc", resolve, progress, reject);
    });
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
    })
}


function loadObjectModel(obj, mat){
    console.log(obj);
    console.log(mat);
    var progress; // = console.log;

    return new Promise(function(resolve, reject) {
        var mtlLoader = new THREE.MTLLoader();
        // mtlLoader.setPath(path);
        mtlLoader.load(mat, function(materials){
            materials.preload();
            var objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials);
            objLoader.load(obj, resolve, progress, reject);
        },progress, reject);
    })
}

function loadDRACOModel(path, name) {
    console.log("in load DRACO model");

    var progress1 = console.log;
    var progress2 = console.log;

    return new Promise(function (resolve, reject) {
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath(path);
        mtlLoader.load(name + ".mtl", function (materials) {

            materials.preload();

            THREE.DRACOLoader.setDecoderPath('js/');
            THREE.DRACOLoader.setDecoderConfig({
                type: 'js'
            });
            var dracoLoader = new THREE.DRACOLoader();
            dracoLoader.load(path + name + ".drc", resolve, progress2, reject);
            // dracoLoader.load( path + name + ".drc", function ( geometry ) {


            //     geometry.computeVertexNormals();

            //     var mesh = new THREE.Mesh( geometry, materials );
            //     model = mesh;
            //     // scene.add(mesh);
            // 	// mesh.castShadow = true;
            // 	// mesh.receiveShadow = true;
            // 	// scene.add( mesh );

            // 	// Release decoder resources.
            //     THREE.DRACOLoader.releaseDecoderModule();
            //     return mesh;

            // }, pro =>{
            //     console.log(pro);
            // }, function(){
            //     console.log("hey");
            //  } );

            // dracoLoader.setMaterials(materials);
            // dracoLoader.setPath(path);
            // dracoLoader.load(name + ".obj", resolve, progress, reject);

        }, progress1, reject);
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
function causeHop() {
    littleHop(model);
}

//ugly function to rotate 
function rotateOnce(model) {
    rotationDone = false;
    var id = setInterval(frame, 10);
    var progress = 0;

    function frame() {
        if (progress >= 125) {
            clearInterval(id);
            rotationDone = true;
        } else {
            progress++;
            model.rotation.y += 0.05;
            print.rotation.z += 0.05;
        }
    }
}

function float() {
    if (floatProgress >= 160) {
        floatProgress = 0;
    } else if (floatProgress < 40) {
        floatProgress++;
        model.position.y += 0.005;
        // print.scale.set(model.position.z, model.position.z, model.position.z);
    } else if (floatProgress < 80) {
        floatProgress++
        model.position.y -= 0.005;
    } else if (floatProgress < 120) {
        floatProgress++;
        model.position.y -= 0.005;
    } else if (floatProgress < 160) {
        floatProgress++;
        model.position.y += 0.005;
    }
}


// ugly function to animate hop
function littleHop(model) {
    var id = setInterval(frame, 10);
    var progress = 0;

    function frame() {
        if (progress >= 80) {
            clearInterval(id);
        } else if (progress < 10) {
            progress++;
            model.position.y += 0.1;
            model.rotation.y -= 0.01;
        } else if (progress < 20) {
            progress++;
            model.position.y += 0.1;
            model.rotation.y += 0.01;
        } else if (progress < 30) {
            progress++;
            model.position.y -= 0.1;
            model.rotation.y += 0.01;
        } else if (progress < 40) {
            progress++;
            model.position.y -= 0.1;
            model.rotation.y -= 0.01;
        } else if (progress < 50) {
            progress++;
            model.position.y += 0.1;
            model.rotation.y -= 0.01;
        } else if (progress < 60) {
            progress++;
            model.position.y += 0.1;
            model.rotation.y += 0.01;
        } else if (progress < 70) {
            progress++;
            model.position.y -= 0.1;
            model.rotation.y += 0.01;
        } else if (progress < 80) {
            progress++;
            model.position.y -= 0.1;
            model.rotation.y -= 0.01;
        }
    }
}
