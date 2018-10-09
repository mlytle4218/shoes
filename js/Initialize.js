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
var floatAnimation;
var floatRadius = 10;
var floatSpeed = 0.015625;
// var floatSpeed = 0.0078125;
// var floatSpeed = 0.125
var floatDistance = 1;
var initialCameraPosition;
var returnWaitTime = 120;


function loadModelOntoPage(jsonObject) {
    init(jsonObject.gltf, jsonObject.shadow);
}


function init(gltfFile, shadowPrint) {

    // getting the container
    container = document.getElementById(connectingElement);

    // setting up the camera - this position just looks a little better to me
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 50);
    camera.position.set(0, 0, cameraDistance);


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

        floatAnimation = new Float(floatSpeed, model, print, floatDistance, camera, controls);
        animate();
        // setTimeout(function() {
        //     rotateOnce(model);
        // }, 100);
        floatAnimation.startRotate();
        floatAnimation.startFloat();
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
    print.position.set(0, -2, 0);
    print.scale.set(1.1,1.1,1.1);
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


    // animate();
}

window.addEventListener('resize', onWindowResize, false);

window.addEventListener('mousedown', onMouseDown, false);

window.addEventListener('mouseup', onMouseUp, false);



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
        // floatAnimation.start2();
    }
    floatAnimation.tick();
    // console.log(camera);
    renderer.render(scene, camera);
}

// function to register mouse location on click
function onMouseDown(event) {
    // console.log(controls);
    floatAnimation.stopFloat();
    // console.log(floatAnimation.isRotating());
    if (!floatAnimation.isRotating()) {
        floatAnimation.stopFloat();
        keepAnimating = false;
        model.position.x = 0;
        model.position.y = 0;
        model.position.z = 0;
        scene.remove(print);
    }
}

function onMouseUp(event) {
    // console.log("mouse up");
    floatAnimation.startCounting();
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

// function float_old() {
//     if (floatProgress >= 160) {
//         floatProgress = 0;
//     } else if (floatProgress < 40) {
//         floatProgress++;
//         model.position.y += 0.005;
//         // print.scale.set(model.position.z, model.position.z, model.position.z);
//     } else if (floatProgress < 80) {
//         floatProgress++
//         model.position.y -= 0.005;
//     } else if (floatProgress < 120) {
//         floatProgress++;
//         model.position.y -= 0.005;
//     } else if (floatProgress < 160) {
//         floatProgress++;
//         model.position.y += 0.005;
//     }
// }
function Animate(speed, model, distance) {
    this.tick = function () {
    }
}

function Float(speed, model, print, distance, camera, controls) {
    var aniFloatSpeed = speed,
        aniReturnSpeed = speed * 10,
        aniFloatDistance = distance,
        aniFloatDirection = -1,
        aniFloatProgress = aniFloatDistance,
        aniFloatSign = 1,
        aniFloatHasPermission = false,
        aniRotating = false,
        aniRotateProgress = 0,
        aniModel = model,
        aniPrint = print,
        aniICP = {},
        aniCamera = camera,
        aniPrintScaleX = print.scale.x,
        aniPrintScaleY = print.scale.y,
        aniReturnToZero = false;
        isCounting = -1;


    var aniPrintDirection = 1;

    aniICP.position = camera.position.clone();
    aniICP.rotation = camera.rotation.clone();
    aniICP.center = controls.center.clone();

    this.tick = function () {
        if (aniRotating) {
            this.rotate();
        } else if (aniFloatHasPermission & !aniRotating) {
            this.float();
        }
        if (isCounting > returnWaitTime) {
            this.returnToZero();
        } else if (isCounting >= 0) {
            isCounting++;
        }
    }

    this.reOrient = function () {
        // console.log(aniICP);
    }


    this.startRotate = function () {
        aniRotating = true;
    }
    this.rotate = function () {
        if (aniRotateProgress >= 125) {
            aniRotating = false;
        } else {
            aniRotateProgress++;
            aniModel.rotation.y += 0.05;
            aniPrint.rotation.z += 0.05;
        }
    }
    this.isRotating = function(){
        return aniRotating;
    }
    this.startFloat = function () {
        aniFloatHasPermission = true;
        scene.add(print);
    }
    this.stopFloat = function () {
        aniFloatHasPermission = false;
        scene.remove(aniPrint);
    }
    this.float = function () {
        if (aniFloatProgress >= aniFloatDistance) {
            aniFloatProgress = aniFloatDistance;
            aniFloatDirection = -aniFloatDirection;
        } else if (aniFloatProgress <= -1) {
            aniFloatProgress = -1;
            aniFloatDirection = -aniFloatDirection;
            aniPrintDirection = -aniPrintDirection;
        }
        if (this.calcFloat(aniFloatProgress) === 0) {
            aniFloatSign = -aniFloatSign;
        }
        // console.log(this.calcFloat(aniFloatProgress));

        model.position.y = aniFloatSign * this.calcFloat(aniFloatProgress);
        // model.position.y = this.calcFloat(aniFloatProgress);

        // console.log(this.calcFloat(aniFloatProgress));
        print.scale.x = aniPrintScaleX + (0.2* this.calcFloat(aniFloatProgress) * aniFloatDirection);
        print.scale.y = aniPrintScaleY + (0.2* this.calcFloat(aniFloatProgress) * aniFloatDirection);
        aniFloatProgress += (aniFloatSpeed * aniFloatDirection);
    }
    this.float2 =function () {
        console.log(this.calcFloat(aniFloatProgress));
        model.position.y = this.calcFloat(aniFloatProgress);
        aniFloatProgress += (aniFloatSpeed * aniFloatDirection);
    }
    this.returnToZero = function () {
        // console.log(aniICP.position.x - aniCamera.position.x);
        var xFinished = false;
        var yFinished = false;
        var zFinished = false;
        if (Math.abs(aniICP.position.x - aniCamera.position.x) < 0.1){
            // console.log("xfinished");
            aniCamera.position.x = aniICP.position.x;
            xFinished = true;
        } else if ((aniICP.position.x - aniCamera.position.x) < 0 ) {
            aniCamera.position.x -= aniReturnSpeed;
        } else {
            aniCamera.position.x += aniReturnSpeed;
        }
        if (Math.abs(aniICP.position.y - aniCamera.position.y) < 0.1){
            aniCamera.position.y = aniICP.position.y;
            yFinished = true;
        } else if ((aniICP.position.y - aniCamera.position.y) < 0 ) {
            aniCamera.position.y -= aniReturnSpeed;
        } else {
            aniCamera.position.y += aniReturnSpeed;
        }
        if (Math.abs(aniICP.position.z - aniCamera.position.z) < 0.1){
            aniCamera.position.z = aniICP.position.z;
            zFinished = true;
        } else if ((aniICP.position.z - aniCamera.position.z) < 0 ) {
            aniCamera.position.z -= aniReturnSpeed;
        } else {
            aniCamera.position.z += aniReturnSpeed;
        }
        aniCamera.lookAt(aniICP.center);
        if (xFinished & yFinished & zFinished) {
            isCounting = -1;
            this.startFloat();
        }

    }
    this.startReturnToZero = function () {
        aniReturnToZero = true;
    }
    this.calcFloat = function (x) {
        return -Math.pow(x, 2) + 1;
    }
    this.startCounting = function () {
        isCounting = 0;
    }
    this.stopCounting = function () {
        isCounting = -1;
    }

}
