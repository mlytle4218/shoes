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
var cameraDistance = 50;
var floatAnimation;
var floatRadius = 10;
var floatSpeed = 0.015625;
var floatDistance = 1;
var initialCameraPosition;
var returnWaitTime = 60;
var printScale = 1;
var modelLoaded = false;
var modelInitialPosition = new THREE.Vector3(0,5,0);



function loadModelOntoPage(jsonObject) {
    init(jsonObject.gltf, jsonObject.shadow);
}


function init(gltfFile, shadowPrint) {
    window.addEventListener('resize', onWindowResize, false);

    window.addEventListener('mousedown', onMouseDown, false);

    window.addEventListener('mouseup', onMouseUp, false);


    // getting the container
    container = document.getElementById(connectingElement);

    // setting up the camera - this position just looks a little better to me
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 100);
    camera.position.set(0, 0, cameraDistance);




    // setting the scene
    scene = new THREE.Scene();
    var color = new THREE.Color(0xffffff);
    scene.background = color;


    var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xdddddd, 1);
    directionalLight.position.set(1, 1, 0).normalize();
    camera.add(directionalLight);
    scene.add(camera);


    // light = new THREE.AmbientLight(0xcccccc, 0.4);
    // // light.position.set(1,1,0).normalize();
    // scene.add(light);

    // // light
    // var light2 = new THREE.PointLight(0xffffff, 1);
    // var helper = new THREE.PointLightHelper(light2, 1.0, 0xff0000);
    // scene.add(helper);
    // camera.add(light2);

    // flashlight = new THREE.SpotLight(0xffffff, 4, 100);
    // scene.add(flashlight);
    // flashlight.position.set(0, 0, 50);
    // flashlight.target = camera;

    // var spotLightHelper = new THREE.SpotLightHelper(flashlight);
    // scene.add(spotLightHelper);


    // // adding a general ambient light 
    // light = new THREE.HemisphereLight(0xffffff, 0xffffff);
    // light.position.set(0, 1, 0);
    // scene.add(light);
    // var helper = new THREE.HemisphereLightHelper(light, 50);

    // scene.add(helper);

    // var intens = 1;

    // var ten = 20;

    // // White directional light at half intensity shining from the top.
    // directionalLight = new THREE.PointLight(0xffffff, intens);
    // var d = 1;
    // var positionMatrix1 = [1,1,-1,-1];
    // var positionMatrix2 = [1,-1,1,-1];
    // for (var i = 0; i < 1; i++ ){
    //     for (var j = 0; j < 4; j++){
    //         var temp = directionalLight.clone();
    //         temp.position.x = d * ten;
    //         temp.position.y = positionMatrix1[j] * ten;
    //         temp.position.z = positionMatrix2[j] * ten;
    //         var helper = new THREE.PointLightHelper(temp, 5);
    //         scene.add(temp);
    //         scene.add(helper);
    //     }
    //     d = -1;
    // }



    // directionalLight.position.set(0, ten, -ten);
    // scene.add(directionalLight);

    // var helper = new THREE.PointLightHelper(directionalLight, 5);

    // scene.add(helper);

    // // White directional light at half intensity shining from the top.
    // directionalLight2 = new THREE.PointLight(0xffffff, intens);
    // directionalLight2.position.set(0, ten, ten);
    // scene.add(directionalLight2);

    // var helper2 = new THREE.PointLightHelper(directionalLight2, 5);

    // scene.add(helper2);

    // directionalLight3 = new THREE.PointLight(0xffffff, intens);
    // directionalLight3.position.set(0,-ten, ten);
    // scene.add(directionalLight3);

    // var helper3 = new THREE.PointLightHelper(directionalLight3, 5);
    // scene.add(helper3);

    // directionalLight4 = new THREE.PointLight(0xffffff, intens);
    // directionalLight4.position.set(0,-ten, -ten);
    // scene.add(directionalLight4);

    // var helper4 = new THREE.PointLightHelper(directionalLight4, 5);
    // scene.add(helper4);

    // var spotLight = new THREE.SpotLight(0xffffff);
    // spotLight.position.set(0, 100, 100);

    // spotLight.castShadow = true;

    // spotLight.shadow.mapSize.width = 1024;
    // spotLight.shadow.mapSize.height = 1024;

    // spotLight.shadow.camera.near = 500;
    // spotLight.shadow.camera.far = 4000;
    // spotLight.shadow.camera.fov = 30;

    // scene.add(spotLight);

    // var spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);

    // var SpotLight2 = new THREE.SpotLight(0xffffff);
    // SpotLight2.position.set(0, -100, 100);

    // SpotLight2.castShadow = true;

    // SpotLight2.shadow.mapSize.width = 1024;
    // SpotLight2.shadow.mapSize.height = 1024;

    // SpotLight2.shadow.camera.near = 500;
    // SpotLight2.shadow.camera.far = 4000;
    // SpotLight2.shadow.camera.fov = 30;

    // scene.add(SpotLight2);

    // var SpotLightHelper2 = new THREE.SpotLightHelper(SpotLight2);
    // scene.add(SpotLightHelper2);

    // var textMaterial = new THREE.MeshLambertMaterial({
    //     color: 0xff0000
    // });
    // var fontLoader = new THREE.FontLoader();
    // fontLoader.load("fonts/OpenSans-Bold.json", function (fnt) {
    //     var textGeometry = new THREE.TextGeometry("Loading...", {
    //         font: fnt,
    //         size: 5,
    //         height: 2,
    //         curveSegments: 10,
    //         bevelThickness: 1,
    //         bevelSize: 0.3,
    //         bevelSegments: 3,
    //         bevelEnabled: true
    //     });
    //     textGeometry.computeBoundingBox();
    //     textGeometry.computeVertexNormals();

    //     text = new THREE.Mesh(textGeometry, textMaterial);
    //     text.position.x = -textGeometry.boundingBox.max.x / 2;
    //     text.position.y = textGeometry.boundingBox.max.y / 2;
    //     console.log(text.position.x);
    //     console.log(text.position.y);
    //     scene.add(text);
    //     animate();
    // });

    var geometry = new THREE.BoxGeometry(33,3,3);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    cube = new THREE.Mesh(geometry, material);
    cube.scale.x = 0.0001;
    var material2 = new THREE.MeshBasicMaterial({
        color: 0xcccccc
    });
    cube2 = new THREE.Mesh(geometry, material2);
    // cube2.position.x = -(cube.geometry.parameters.width/2);
    cube2.position.z = -1;
    scene.add(cube2);

    // 
    // cube.position.x = -11.5;
    // cube.position.x = -(1 - cube.scale.x) * (cube.geometry.parameters.width/2)
    scene.add(cube);

    var gltfLoader = new THREE.GLTFLoader();
    var progress; // = console.log;

    gltfLoader.load(gltfFile, function (gltf) {
        model = gltf.scene;
        model.rotation.y = -Math.PI / 2;
        var scale = 0.25;
        model.scale.set(scale, scale, scale);
        model.position.copy(modelInitialPosition);
        scene.add(model);
        scene.add(print);
        modelLoaded = true;
        scene.remove(cube);
        scene.remove(cube2);

        floatAnimation = new Float(floatSpeed, model, print, floatDistance, camera, controls);
        // animate();
        floatAnimation.startRotate();
        floatAnimation.startFloat();
    }, function (progress) {
        pro = progress.loaded/progress.total;
        cube.scale.x = pro;
        cube.position.x = -(1 - cube.scale.x) * (cube.geometry.parameters.width/2);
        // console.log(progress.loaded/progress.total);
    }, function (error) {
        console.error(error);
    });


    // var fbxLoader = new THREE.FBXLoader();
    // var progress = console.log;
    // fbxLoader.load(gltfFile, function (fbx) {
    //     model = fbx;
    //     // model.rotation.y = -Math.PI / 2;
    //     var scale = 0.5;
    //     model.scale.set(scale,scale,scale);
    //     scene.add(model);
    //     scene.add(print);
    //     // modelLoaded = true;

    //     floatAnimation = new Float(floatSpeed, model, print, floatDistance, camera, controls);
    //     animate();
    //     floatAnimation.startRotate();
    //     floatAnimation.startFloat();
    // }, progress, function (error) {
    //     console.error(error);
    // });


    // var objLoader = new THREE.OBJLoader();
    // var progress = console.log;
    // objLoader.load(gltfFile, function(obj){
    //     model = obj;
    //     scene.add(model.children[0]);
    //     scene.add(print);
    //     floatAnimation = new Float(floatSpeed, model, print, floatDistance, camera, controls);
    //     animate();
    // },progress , function (error) {
    //     console.error(error);
    // });



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
    print.position.set(0, -5, 0);
    print.scale.set(printScale, printScale, printScale);
    print.rotation.x = (Math.PI / 2) * 3;
    print.rotation.z = (Math.PI / 2);

    // adding raycaster and mouse for comparing mouse actions to object posistions
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();



    // ading the orbit controls - pan and zoom
    controls = new THREE.OrbitControls(camera, document.getElementById(connectingElement));
    controls.target.set(0, 5, 0);
    // the max and min zoom here
    controls.maxDistance = cameraDistance;
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


    animate();
}


// window.addEventListener('resize', onWindowResize, false);

// window.addEventListener('mousedown', onMouseDown, false);

// window.addEventListener('mouseup', onMouseUp, false);



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
    if (modelLoaded) {
        floatAnimation.tick();
    }
    // floatAnimation.tick();
    // console.log(camera);
    renderer.render(scene, camera);
}

// function to register mouse location on click
function onMouseDown(event) {
    if (inContainer(event)){
        // console.log(controls);
        floatAnimation.stopFloat();
        // console.log(floatAnimation.isRotating());
        if (!floatAnimation.isRotating()) {
            floatAnimation.stopFloat();
            keepAnimating = false;
            model.position.copy(modelInitialPosition);
            // model.position.x = 0;
            // model.position.y = 0;
            // model.position.z = 0;
            scene.remove(print);
        }

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
        aniReturnProgress = 200,
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
    this.isRotating = function () {
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

        model.position.y = aniFloatSign * this.calcFloat(aniFloatProgress) + modelInitialPosition.y;
        // model.position.y = this.calcFloat(aniFloatProgress);

        // console.log(this.calcFloat(aniFloatProgress));
        print.scale.x = aniPrintScaleX + (0.2 * this.calcFloat(aniFloatProgress) * aniFloatDirection);
        print.scale.y = aniPrintScaleY + (0.2 * this.calcFloat(aniFloatProgress) * aniFloatDirection);
        aniFloatProgress += (aniFloatSpeed * aniFloatDirection);
    }
    this.float2 = function () {
        console.log(this.calcFloat(aniFloatProgress));
        model.position.y = this.calcFloat(aniFloatProgress);
        aniFloatProgress += (aniFloatSpeed * aniFloatDirection);
    }
    this.returnToZero = function () {
        console.log("returnToZero");

        // // console.log(aniICP.position.x - aniCamera.position.x);
        // var xFinished = false;
        // var yFinished = false;
        // var zFinished = false;
        // if (Math.abs(aniICP.position.x - aniCamera.position.x) < 0.1) {
        //     // console.log("xfinished");
        //     aniCamera.position.x = aniICP.position.x;
        //     xFinished = true;
        // } else if ((aniICP.position.x - aniCamera.position.x) < 0) {
        //     aniCamera.position.x -= aniReturnSpeed;
        // } else {
        //     aniCamera.position.x += aniReturnSpeed;
        // }
        // if (Math.abs(aniICP.position.y - aniCamera.position.y) < 0.1) {
        //     aniCamera.position.y = aniICP.position.y;
        //     yFinished = true;
        // } else if ((aniICP.position.y - aniCamera.position.y) < 0) {
        //     aniCamera.position.y -= aniReturnSpeed;
        // } else {
        //     aniCamera.position.y += aniReturnSpeed;
        // }
        // if (Math.abs(aniICP.position.z - aniCamera.position.z) < 0.1) {
        //     aniCamera.position.z = aniICP.position.z;
        //     zFinished = true;
        // } else if ((aniICP.position.z - aniCamera.position.z) < 0) {
        //     aniCamera.position.z -= aniReturnSpeed;
        // } else {
        //     aniCamera.position.z += aniReturnSpeed;
        // }
        // aniCamera.lookAt(aniICP.center);
        // if (xFinished & yFinished & zFinished) {
        //     isCounting = -1;
        //     this.startFloat();
        // }

    }

    function setArc3D(pointStart, pointEnd, smoothness, color, clockWise) {
        // calculate a normal ( taken from Geometry().computeFaceNormals() )
        var cb = new THREE.Vector3(),
            ab = new THREE.Vector3(),
            normal = new THREE.Vector3();
        cb.subVectors(new THREE.Vector3(), pointEnd);
        ab.subVectors(pointStart, pointEnd);
        cb.cross(ab);
        normal.copy(cb).normalize();


        var angle = pointStart.angleTo(pointEnd); // get the angle between vectors
        if (clockWise) angle = angle - Math.PI * 2; // if clockWise is true, then we'll go the longest path
        var angleDelta = angle / (smoothness - 1); // increment

        var geometry = new THREE.Geometry();
        for (var i = 0; i < smoothness; i++) {
            geometry.vertices.push(pointStart.clone().applyAxisAngle(normal, angleDelta * i)) // this is the key operation
        }

        var arc = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: color
        }));
        return arc;
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

function inContainer(event) {
    if (event.clientX > container.offsetLeft & event.clientX < container.offsetLeft + container.clientWidth) {
        if (event.clientY > container.offsetTop & event.clientY < container.offsetTop + container.clientHeight) {
            return true;
        }
    }
    return false;
}
