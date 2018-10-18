// Setting global variables
var connectingElement = "product-canvas";
var cameraDistance = 50;
var modelInitialPosition = new THREE.Vector3(0, -4, 0);
var shoeRenderer;
var shoeCamera;
var shoeScene;
var shoeContainer;
var animation;
var modelScale = .8;

function loadModelOntoPage(json) {
    //Setting the mouse listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);

    // getting the shoeContainer
    shoeContainer = document.getElementById(connectingElement);

    // setting up the camera - this position just looks a little better to me
    shoeCamera = new THREE.PerspectiveCamera(45, shoeContainer.clientWidth / shoeContainer.clientHeight, 1, 100);
    shoeCamera.position.set(0, 0, cameraDistance);

    // setting the scene
    shoeScene = new THREE.Scene();
    var color = new THREE.Color(0xffffff);
    shoeScene.background = color;


    // setting the ambient light for the model
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    shoeScene.add(ambientLight);

    // setting the point light that stays with the camera
    var pointLight = new THREE.PointLight(0x999999, 0.05, 100, 1);
    pointLight.position.set(0, 0, -1).normalize();
    pointLight.castShadow = true;
    shoeCamera.add(pointLight);

    // setting a directional light directly over the model to light and cast shadows
    var directionalLight = new THREE.SpotLight(0xffffff);
    directionalLight.position.set(0, 25, 0);
    directionalLight.castShadow = true;

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default
    directionalLight.shadow.camera = new THREE.OrthographicCamera(-75, 75, 75, -75, 0.5, 1000);
    shoeScene.add(directionalLight);

    // add the camera so the pointlight following the camera will work
    shoeScene.add(shoeCamera);

    // setting the plane to which the model's shadow will cast
    var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 32, 32);
    var planeMaterial = new THREE.ShadowMaterial({
        opacity: 0.2
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "shadowPlane";
    plane.receiveShadow = true;
    plane.rotation.x = -(Math.PI / 36) * 17;
    plane.position.y = -7;
    shoeScene.add(plane);

    // add the progress bar cubes
    // createProgress(shoeScene);

    // ading the orbit controls - pan and zoom
    var controls = new THREE.OrbitControls(shoeCamera, shoeContainer);
    controls.target.set(0, 5, 0);
    // the max and min zoom here
    controls.maxDistance = cameraDistance;
    controls.minDistance = 10;
    controls.update();


    //set renderer
    shoeRenderer = new THREE.WebGLRenderer({
        antialias: true
    });
    shoeRenderer.setPixelRatio(window.devicePixelRatio);
    shoeRenderer.setSize(shoeContainer.clientWidth, shoeContainer.clientHeight);
    shoeRenderer.gammaOutput = false;
    shoeRenderer.gammaInput = true;
    shoeRenderer.gammaOutput = true;
    shoeRenderer.shadowMap.enabled = true;
    shoeRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    shoeContainer.appendChild(shoeRenderer.domElement);

    var envMap = new THREE.CubeTextureLoader().load([
        'pics/posx.jpg',
        'pics/negx.jpg',
        'pics/posy.jpg',
        'pics/negy.jpg',
        'pics/posz.jpg',
        'pics/negz.jpg'
    ])



    // setting up the animation
    animation = new AnimateModel();


    // setting up the loaders to bring in the models and update the progrss bars as well

    var progresses = [0, 0];

    var gltfLoader = new THREE.GLTFLoader();

    gltfLoader.load(json.fab, function (fab) {
        fab.scene.children[0].material.roughness = 0.8;
        fab.scene.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        });

        gltfLoader.load(json.shiny, function (shiny) {
            shiny.scene;
            shiny.scene.children[0].material.roughness = 0.2;
            shiny.scene.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                }
            });
            fab.scene.rotation.y = Math.PI / 2;
            fab.scene.scale.set(modelScale, modelScale, modelScale);
            fab.scene.add(shiny.scene);
            shoeScene.add(fab.scene);
            fab.scene.position.copy(modelInitialPosition);
            fab.scene.traverse( function (child){
                if (child.isMesh ) {
                    child.material.envMap = envMap;
                }
            });
            removeProgress();
            animation.setModel(fab.scene);
            animation.startRotate();
            animation.startFloat();
            addGui();

        }, function (progress) {
            console.log(progress);
            var pro = progress.loaded / progress.total;
            var proResult = pro - progresses[1];
            progresses[1] = pro;
            updateProgress(proResult / 2);
        }, function (error) {
            console.error(error);
        });
    }, function (progress) {
        var pro = progress.loaded / progress.total;
        var proResult = pro - progresses[0];
        progresses[0] = pro;
        updateProgress(proResult / 2);
    }, function (error) {
        console.error(error);
    });




    // var progress = console.log;
    // var err = console.error;

    // mtl_loader = new THREE.MTLLoader();
    // mtl_loader.load("models/makeItRain.mtl",
    //     function (materials) {
    //         materials.preload()
    //         var obj_loader = new THREE.OBJLoader();
    //         obj_loader.setMaterials(materials)
    //         obj_loader.load("models/makeItRain.obj",
    //             function (object) {
    //                 let mesh = object.children[0]
    //                 mesh.material.envMap = envMap;
    //                 shoeScene.add(mesh);
    //             }, progress, function (error) { alert(error) }
    //         )
    //     }, progress, function (error) { alert(error) }
    // );






















    animate();

}

function addGui(){

    var params = { ambientColor : '#ffffff'}
    var gui = new dat.GUI();
    var model = gui.addFolder('Ambient Light');
    model.addColor(params, 'ambientColor',0,1).onChange(function (){
        var tempColor = new THREE.Color( params.ambientColor);
        shoeScene.children[0].color = new THREE.Color(tempColor.getStyle());
    });
    model.add(shoeScene.children[0], 'intensity',0,1).listen();

    var model = gui.addFolder('Point Light');
    model.addColor(params, 'ambientColor',0,1).onChange(function (){
        var tempColor = new THREE.Color( params.ambientColor);
        shoeScene.children[1].color = new THREE.Color(tempColor.getStyle());
    });
    model.add(shoeScene.children[1], 'intensity',0,1).listen();

    var model = gui.addFolder('Directional Light');
    model.addColor(params, 'ambientColor',0,1).onChange(function (){
        var tempColor = new THREE.Color( params.ambientColor);
        shoeScene.children[2].children[0].color = new THREE.Color(tempColor.getStyle());
    });
    model.add(shoeScene.children[2].children[0], 'intensity',0,1).listen();
    
    var model = gui.addFolder('Fabric Model');
    model.add(shoeScene.children[4].children[0].material, 'roughness',0,1).listen();
    model.add(shoeScene.children[4].children[0].material, 'bumpScale',0,1).listen();
    model.add(shoeScene.children[4].children[0].material, 'metalness',0,1).listen();
    var model = gui.addFolder('Shiny Model');
    model.add(shoeScene.children[4].children[1].children[0].material, 'roughness',0,1).listen();
    model.add(shoeScene.children[4].children[1].children[0].material, 'bumpScale',0,1).listen();
    model.add(shoeScene.children[4].children[1].children[0].material, 'metalness',0,1).listen();
}

function createProgress(sceneVar) {
    // setting the cubes for the progress bar
    var geometry = new THREE.BoxGeometry(33, 3, 3);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });
    var cubeFront = new THREE.Mesh(geometry, material);
    cubeFront.scale.x = 0.0001;
    cubeFront.position.y = 5;
    cubeFront.name = "cubeFront";
    var material2 = new THREE.MeshBasicMaterial({
        color: 0xcccccc
    });
    var cubeBack = new THREE.Mesh(geometry, material2);
    cubeBack.position.z = -1;
    cubeBack.position.y = 5;
    cubeBack.name = "cubeBack";
    sceneVar.add(cubeBack);
    sceneVar.add(cubeFront);

}

function updateProgress(progress) {
    shoeScene.children.forEach(function (element) {
        if (element.name === "cubeFront") {
            element.scale.x += progress;
            element.position.x = -(1 - element.scale.x) * (element.geometry.parameters.width / 2);
        }
    });
}

function removeProgress() {
    var front;
    var back;
    shoeScene.children.forEach(function (element) {
        if (element.name === "cubeFront") {
            front = element;
        }
        if (element.name === "cubeBack") {
            back = element;
        }
    });
    shoeScene.remove(front);
    shoeScene.remove(back);
}

function onWindowResize() {
    shoeCamera.aspect = shoeContainer.clientWidth / shoeContainer.clientHeight;
    shoeCamera.updateProjectionMatrix();
    shoeRenderer.setSize(shoeContainer.clientWidth, shoeContainer.clientHeight)
}

function onMouseDown(event) {
    if (inContainer(event)) {
        if (!animation.isRotating()) {

            shoeScene.children.forEach(function (element) {
                if (element.name === "shadowPlane") {
                    shoeScene.remove(element);
                    animation.stopFloat();
                }
            });
        }
    }
}

function onMouseUp(event) {

}

function inContainer(thisEvent) {
    if (thisEvent.clientX > shoeContainer.offsetLeft & thisEvent.clientX < shoeContainer.offsetLeft + shoeContainer.clientWidth) {
        if (thisEvent.clientY > shoeContainer.offsetTop & thisEvent.clientY < shoeContainer.offsetTop + shoeContainer.clientHeight) {
            return true;
        }
    }
    return false;
}
// **********************************************************
function animate() {
    if (animation.hasModel()) {
        animation.tick();
    }
    requestAnimationFrame(animate);
    shoeRenderer.render(shoeScene, shoeCamera);
}

function AnimateModel() {
    var AMmodel;
    var AMRotating = false;
    var AMRotateProgress = 0;
    var AMFloatHasPermission = false;
    var AMFloatProgress = 0;
    var AMFloatSign = 1;
    var AMFloatSpeed = 0.015625;
    var AMFloatDistance = 1;
    var AMFloatDirection = -1;



    this.tick = function () {
        if (AMRotating) {
            this.rotate();
        } else if (AMFloatHasPermission & !AMRotating) {
            this.float();
        }
    }
    this.hasModel = function () {
        return AMmodel;
    }
    this.setModel = function (model) {
        AMmodel = model;
    }


    this.startRotate = function () {
        AMRotating = true;
    }
    this.rotate = function () {
        if (AMRotateProgress >= 125) {
            AMRotating = false;
        } else {
            AMRotateProgress++;
            AMmodel.rotation.y += 0.05;
        }
    }
    this.isRotating = function () {
        return AMRotating;
    }

    this.startFloat = function () {
        AMFloatHasPermission = true;
    }
    this.stopFloat = function () {
        AMFloatHasPermission = false;
    }
    this.float = function () {
        if (AMFloatProgress >= AMFloatDistance) {
            AMFloatProgress = AMFloatDistance;
            AMFloatDirection = -AMFloatDirection;
        } else if (AMFloatProgress <= -1) {
            AMFloatProgress = -1;
            AMFloatDirection = -AMFloatDirection;
        }
        if (this.calcFloat(AMFloatProgress) === 0) {
            AMFloatSign = -AMFloatSign;
        }
        AMmodel.position.y = AMFloatSign * this.calcFloat(AMFloatProgress) - 1 + modelInitialPosition.y;
        AMFloatProgress += (AMFloatSpeed * AMFloatDirection);
    }

    this.calcFloat = function (x) {
        return -Math.pow(x, 2) + 1;
    }

}
