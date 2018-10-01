/*
	Developed my Marc Lytle 2018
*/
var container, controls, model;
var fileName, fileExt, path;
var camera, scene, renderer, light, light3, raycaster, mouse, plane, print;
var rotationDone = false;
var keepAnimating = true;
var floatProgress = 0;
var skyColor = 0xffffff;
var connectingElement = 'product-canvas';
var cameraDistance = 500;
var shadowPrint;
var gltfFile;


function loadModelOntoPage(jsonObject) {
    shadowPrint = jsonObject.shadow;
    gltfFile = jsonObject.gltf;
    init();
    animate();
}


function init() {

    // getting the container
    container = document.getElementById(connectingElement);
    // document.body.appendChild(container);

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
    scene.add(light);

    var gltfLoader = new THREE.GLTFLoader();
    var progress;// = console.log;
    gltfLoader.load(gltfFile, function (gltf) {
        model = gltf.scene;
        model.rotation.y = -Math.PI / 2;
        scene.add(model);
        scene.add(print);
        modelLoaded = true;
        setTimeout(function() {
            rotateOnce(model);
        }, 100);
    }, progress, function (error) {
        console.error(error);
    });



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
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// actually animating the scene including orbit changes

function animate() {
    requestAnimationFrame(animate);
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

