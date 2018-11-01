// Setting global variables
var connectingElement = "product-canvas";
var cameraDistance = 50;
var modelInitialPosition = new THREE.Vector3(0, -1.5, 0);
var shoeRenderer;
var shoeCamera;
var shoeScene;
var shoeContainer;
var animation;
var modelScale = .8;
var shoeComposer;
var shoeRenderPass;
var shoeSsaoPass;
var shoeTaaRenderPass;
var rotationAnimationSpeed = 0.05;
var modelInitialRotation = Math.PI / 2;


function loadModelOntoPage(json) {
    if (json.config){
        var request = new XMLHttpRequest();
        request.open("GET", json.config, false);
        request.send(null);
        json.config = JSON.parse(request.responseText);
    }

    // getting the shoeContainer
    shoeContainer = document.getElementById(connectingElement);

    //Setting the mouse listeners
    shoeContainer.addEventListener('resize', onWindowResize, false); 
    shoeContainer.addEventListener('mousedown', onMouseDown, false);
    shoeContainer.addEventListener('mouseup', onMouseUp, false);

    // setting up the camera - this position just looks a little better to me
    shoeCamera = new THREE.PerspectiveCamera(45, shoeContainer.clientWidth / shoeContainer.clientHeight, 1, 150);
    shoeCamera.position.set(0, 0, cameraDistance);

    // setting the scene
    shoeScene = new THREE.Scene();
    var color = new THREE.Color(0xffffff);
    shoeScene.background = color;

    // setting the ambient light for the model
    var ambientLight;
    if (json.config && json.config.ambientLight){
        ambientLight = new THREE.AmbientLight(
            parseInt(json.config.ambientLight.color, 16),
            json.config.ambientLight.intesity
            );
        if (json.config.ambientLight.on){
            shoeScene.add(ambientLight);
        }
    } else {
        ambientLight = new THREE.AmbientLight(0x9999999, 0.8);
        shoeScene.add(ambientLight);
    }

    // setting the point light that stays with the camera
    var pointLight;
    if (json.config && json.config.cameraLight){
        pointLight = new THREE.PointLight(
            parseInt(json.config.cameraLight.color,16),
            json.config.cameraLight.intesity, 
            json.config.cameraLight.distance, 
            json.config.cameraLight.decay);
        pointLight.position.set(
            json.config.cameraLight.x,
            json.config.cameraLight.y,
            json.config.cameraLight.z
            );
        if (json.config.cameraLight.on){
            shoeCamera.add(pointLight);
            // add the camera so the pointlight following the camera will work
            shoeScene.add(shoeCamera);
        }
    } else {
        pointLight = new THREE.PointLight(0x999999, 0.05, 11, 2);
        pointLight.position.set(0, -10, 0);
        shoeCamera.add(pointLight);
        // add the camera so the pointlight following the camera will work
        shoeScene.add(shoeCamera);
    }



    // setting a directional light directly over the model to light and cast shadows
    var directionalLight;
    if (json.config && json.config.mainLight){
        directionalLight = new THREE.DirectionalLight(
            parseInt(json.config.mainLight.color,16),
            json.config.mainLight.intesity);
        directionalLight.position.set(
            json.config.mainLight.x,
            json.config.mainLight.y,
            json.config.mainLight.z);
        directionalLight.castShadow = json.config.mainLight.shadow;
        if (json.config.mainLight.helper){
                var helper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
                directionalLight.add(helper);
        }
        directionalLight.shadow.mapSize.width = 512; // default
        directionalLight.shadow.mapSize.height = 512; // default
        directionalLight.shadow.camera.near = 0.5; // default
        directionalLight.shadow.camera.far = 500; // default
        directionalLight.shadow.camera = new THREE.OrthographicCamera(-75, 75, 75, -75, 0.5, 1000);
        if (json.config.mainLight.on){
            shoeScene.add(directionalLight);
        }
    } else {
        directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 40, 0);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 512; // default
        directionalLight.shadow.mapSize.height = 512; // default
        directionalLight.shadow.camera.near = 0.5; // default
        directionalLight.shadow.camera.far = 500; // default
        directionalLight.shadow.camera = new THREE.OrthographicCamera(-75, 75, 75, -75, 0.5, 1000);
        shoeScene.add(directionalLight);
    }

    //Set up shadow properties for the light
    

    // setting a directional light directly over the model to light and cast shadows
    var directionalLight2;
    if (json.config && json.config.backLight){
        directionalLight2 = new THREE.DirectionalLight(
            parseInt(json.config.backLight.color,16),
            json.config.backLight.intesity);
        directionalLight2.position.set(
            json.config.backLight.x,
            json.config.backLight.y,
            json.config.backLight.z);
        directionalLight2.castShadow = json.config.backLight.shadow;
        if (json.config.backLight.helper){
                var helper = new THREE.DirectionalLightHelper(directionalLight2, 5, 0x0000ff);
                directionalLight2.add(helper);
        }
        if (json.config.backLight.on){
            shoeScene.add(directionalLight2);
        }
    } else {
        directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-10, 40, 0);
        shoeScene.add(directionalLight2);
    }


    // setting a directional light directly over the model to light and cast shadows
    var directionalLight3;
    if (json.config && json.config.frontLight){
        directionalLight3 = new THREE.DirectionalLight(
            parseInt(json.config.frontLight.color,16),
            json.config.frontLight.intesity);
        directionalLight3.position.set(
            json.config.frontLight.x,
            json.config.frontLight.y,
            json.config.frontLight.z);
        directionalLight3.castShadow = json.config.frontLight.shadow;
        if (json.config.frontLight.helper){
                var helper = new THREE.DirectionalLightHelper(directionalLight3, 5, 0x00ff00);
                directionalLight3.add(helper);
        }
        if (json.config.frontLight.on){
            shoeScene.add(directionalLight3);
        }
    } else {
        directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight3.position.set(10, 40, 0);
        shoeScene.add(directionalLight3);
    }

    // setting the plane to which the model's shadow will cast
    var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 32, 32);
    var planeMaterial = new THREE.ShadowMaterial({
        opacity: 0.2
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "shadowPlane";
    plane.receiveShadow = true;
    plane.rotation.x = -(Math.PI / 36) * 17;
    plane.position.y = modelInitialPosition.y - 5;
    shoeScene.add(plane);

    // add the progress bar cubes
    var progressObject = new Progress(shoeScene, json.totalFileSize);
    progressObject.create();

    // ading the orbit controls - pan and zoom
    var controls = new THREE.OrbitControls(shoeCamera, shoeContainer);
    controls.target.set(0, 5, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    // the max and min zoom here
    controls.maxDistance = cameraDistance;
    controls.minDistance = 10;
    controls.update();


//     var renderer = new THREE.WebGLRenderer({canvas: canvas});
// canvas.width  = canvas.clientWidth;
// canvas.height = canvas.clientHeight;
// renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);


    //set renderer
    shoeRenderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: shoeContainer
    });
    shoeContainer.width = shoeContainer.clientWidth;
    shoeContainer.height = shoeContainer.clientHeight;

    shoeRenderer.setPixelRatio(window.devicePixelRatio);
    // shoeRenderer.setSize((shoeContainer.clientWidth),(shoeContainer.clientHeight));
    shoeRenderer.setViewport(0,0,(shoeContainer.clientWidth),(shoeContainer.clientHeight));
    shoeRenderer.gammaInput = true;
    shoeRenderer.gammaOutput = true;
    shoeRenderer.shadowMap.enabled = true;
    shoeRenderer.shadowMap.type = THREE.PCFSoftShadowMap; 

    shoeRenderer.physicallyBasedShading = true;

    // shoeContainer.appendChild(shoeRenderer.domElement);


    // var envMap = new THREE.CubeTextureLoader().load([ 
    //     'pics/xp.png',
    //     'pics/xn.png',
    //     'pics/yp.png',
    //     'pics/yn.png',
    //     'pics/zp.png',
    //     'pics/zn.png'
    // ])



    // setting up the animation
    animation = new AnimateModel();


    var err; // = console.error;

    mtl_loader = new THREE.MTLLoader();
    var matS = mtl_loader.loadNew('KT4S', json.diffuse, json.normal, json.rough);
    var matF = mtl_loader.loadNew('KT4F', json.diffuse, json.normal, json.rough);

    matS.preload();
    matF.preload();

    var obj_loader = new THREE.OBJLoader();
    obj_loader.setMaterials(matS);
    obj_loader.load(json.shiny,
        function (shiny) {
            // shiny.children[0].material.envMap = envMap;
            shiny.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            if (json.config && json.config.shiny){
                shiny.position.y = json.config.shiny.y;
                shiny.scale.set(
                    json.config.shiny.scale,
                    json.config.shiny.scale,
                    json.config.shiny.scale
                    );
                shiny.children[0].material.roughness = json.config.shiny.roughness;
                shiny.children[0].material.metalness = json.config.shiny.metalness;
                shiny.children[0].material.refractionRatio = json.config.shiny.refractionRatio;

            } else {
                shiny.position.y = -5;
                shiny.scale.set(modelScale, modelScale, modelScale);
                shiny.children[0].material.roughness = 0.66;
                shiny.children[0].material.metalness = 0.5;

            }
            shiny.rotation.y = modelInitialRotation;

            obj_loader.setMaterials(matF);
            obj_loader.load(json.fab,
                function (fabric) {
                    // fabric.children[0].material.envMap = envMap;
                    fabric.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    if (json.config && json.config.fabric){
                        fabric.children[0].material.roughness = json.config.fabric.roughness;
                        fabric.children[0].material.metalness = json.config.fabric.metalness;
                        fabric.children[0].material.refractionRatio = json.config.fabric.refractionRatio;
                    } else {
                        fabric.children[0].material.roughness = 0.8;
                    }
                    shiny.add(fabric);
                    shiny.position.copy(modelInitialPosition);
                    shoeScene.add(shiny);
                    // addGui();
                    animation.startRotate();
                    animation.startFloat();
                    animation.setModel(shiny);
                    progressObject.remove();
                },
                function (prog) {
                    progressObject.update('fabric', prog.loaded);
                }, err
            )
        },
        function (prog) {
            progressObject.update('shiny', prog.loaded);
        }, err
    )



    shoeComposer = new THREE.EffectComposer(shoeRenderer);



    shoeRenderPass = new THREE.RenderPass(shoeScene, shoeCamera);
    shoeComposer.addPass(shoeRenderPass);




    // Setup SSAO pass
    shoeSsaoPass = new THREE.SSAOPass(shoeScene, shoeCamera);
    shoeSsaoPass.radius = 35;
    shoeSsaoPass.aoClamp = 0.18;
    shoeSsaoPass.lumInfluence = 0.85;
    shoeSsaoPass.renderToScreen = true;
    shoeComposer.addPass(shoeSsaoPass);

    shoeTaaRenderPass = new THREE.TAARenderPass(shoeScene, shoeCamera);
    shoeTaaRenderPass.unbiased = true;
    shoeTaaRenderPass.sampleLevel = 1;
    shoeComposer.addPass(shoeTaaRenderPass);

    // stats = new Stats();
    // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom);


    animate();


}

// **********************************************************
function animate() {
    // stats.begin();
    // shoeComposer.render();
    if (animation.hasModel()) {
        animation.tick();
    }
    requestAnimationFrame(animate);
    shoeRenderer.render(shoeScene, shoeCamera);
    // stats.end();
}

function Progress(sceneVar, totalSize) {
    var progTotalSize = totalSize;
    var progSceneVar = sceneVar;
    var progObject = new THREE.Object3D();
    var progLastProgress = {};
    var progProgress = 0;
    var progFront;

    this.create = function () {
        var geometry = new THREE.PlaneGeometry(22, 2, 2);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        });
        progFront = new THREE.Mesh(geometry, material);
        progFront.scale.x = 0.000001;
        var material2 = new THREE.MeshBasicMaterial({
            color: 0xcccccc
        });
        var back = new THREE.Mesh(geometry, material2);
        back.position.z = -0.001;
        progObject.add(progFront);
        progObject.add(back);
        // progObject.position.y = 5;
        progObject.rotation.x = 0.052;
        progObject.position.y = 4;
        progObject.position.z = 5;
        progSceneVar.add(progObject);
    }
    this.update = function (key, progressNew) {
        if (key in progLastProgress) {
            progProgress += (progressNew - progLastProgress[key]) / progTotalSize;
            progLastProgress[key] = progressNew;
        } else {
            progLastProgress[key] = 0;
            progProgress += progressNew / progTotalSize;
            progLastProgress[key] = progressNew;

        }
        progFront.scale.x = progProgress;
        progFront.position.x = -(1 - progFront.scale.x) * (progFront.geometry.parameters.width / 2);
    }
    this.remove = function () {
        progSceneVar.remove(progObject);
    }

}

// function createProgress(sceneVar) {
//     // setting the cubes for the progress bar
//     var geometry = new THREE.PlaneGeometry(33, 3, 3);
//     var material = new THREE.MeshBasicMaterial({
//         color: 0xff0000
//     });
//     var cubeFront = new THREE.Mesh(geometry, material);
//     cubeFront.scale.x = 0.0001;
//     cubeFront.position.y = 5;
//     cubeFront.name = "cubeFront";
//     var material2 = new THREE.MeshBasicMaterial({
//         color: 0xcccccc
//     });
//     var cubeBack = new THREE.Mesh(geometry, material2);
//     cubeBack.position.z = -1;
//     cubeBack.position.y = 5;
//     cubeBack.name = "cubeBack";
//     sceneVar.add(cubeBack);
//     sceneVar.add(cubeFront);

// }

// function updateProgress(progress) {
//     shoeScene.children.forEach(function (element) {
//         if (element.name === "cubeFront") {
//             element.scale.x += progress;
//             element.position.x = -(1 - element.scale.x) * (element.geometry.parameters.width / 2);
//         }
//     });
// }

// function removeProgress() {
//     var front;
//     var back;
//     shoeScene.children.forEach(function (element) {
//         if (element.name === "cubeFront") {
//             front = element;
//         }
//         if (element.name === "cubeBack") {
//             back = element;
//         }
//     });
//     shoeScene.remove(front);
//     shoeScene.remove(back);
// }

function onWindowResize() {
    shoeCamera.aspect = shoeContainer.clientWidth / shoeContainer.clientHeight;
    shoeCamera.updateProjectionMatrix();
    shoeRenderer.setSize(shoeContainer.clientWidth, shoeContainer.clientHeight)
}

function onMouseDown(event) {
    shoeScene.children.forEach(function (element) {
        if (element.name === "shadowPlane") {
            shoeScene.remove(element);
            animation.stopFloat();
        }
        animation.stopRotate();
    });
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


function AnimateModel() {
    var AMmodel;
    var AMRotating = false;
    var AMRotateProgress = 0;
    var AMFloatHasPermission = false;
    var AMFloatProgress = 0;
    var AMFloatSign = 1;
    var AMFloatSpeed = 0.015625;
    // var AMFloatSpeed = 0.0625;
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
    this.stopRotate = function () {
        AMRotating = false;
    }
    this.rotate = function () {
        if (AMRotating){
            if (AMRotateProgress >= ((2 * Math.PI))) {
                this.stopRotate();
            } else {
                AMRotateProgress += rotationAnimationSpeed;
                AMmodel.rotation.y = modelInitialRotation + AMRotateProgress;
            }
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

function addGui() {

    var params = {
        ambientColor: '#ffffff'
    }
    var gui = new dat.GUI();
    var ambient = gui.addFolder('Ambient Light');
    ambient.addColor(params, 'ambientColor', 0, 1).onChange(function () {
        var tempColor = new THREE.Color(params.ambientColor);
        shoeScene.children[0].color = new THREE.Color(tempColor.getStyle());
    });
    ambient.add(shoeScene.children[0], 'intensity', 0, 1).listen();

    var point = gui.addFolder('Point Light');
    point.addColor(params, 'ambientColor', 0, 1).onChange(function () {
        var tempColor = new THREE.Color(params.ambientColor);
        shoeScene.children[4].children[0].color = new THREE.Color(tempColor.getStyle());
    });
    point.add(shoeScene.children[4].children[0], 'intensity', 0, 1).listen();

    var directional = gui.addFolder('Directional Light');
    directional.addColor(params, 'ambientColor', 0, 1).onChange(function () {
        var tempColor = new THREE.Color(params.ambientColor);
        shoeScene.children[1].color = new THREE.Color(tempColor.getStyle());
    });
    directional.add(shoeScene.children[1], 'intensity', 0, 1).listen();

    var directional = gui.addFolder('Directional Light NegY');
    directional.addColor(params, 'ambientColor', 0, 1).onChange(function () {
        var tempColor = new THREE.Color(params.ambientColor);
        shoeScene.children[2].color = new THREE.Color(tempColor.getStyle());
    });
    directional.add(shoeScene.children[2], 'intensity', 0, 1).listen();

    var directional = gui.addFolder('Directional Light PosY');
    directional.addColor(params, 'ambientColor', 0, 1).onChange(function () {
        var tempColor = new THREE.Color(params.ambientColor);
        shoeScene.children[3].color = new THREE.Color(tempColor.getStyle());
    });
    directional.add(shoeScene.children[3], 'intensity', 0, 1).listen();

    var fabric = gui.addFolder('Fabric Model');
    fabric.add(shoeScene.children[6].children[1].children[0].material, 'roughness', 0, 1).listen();
    fabric.add(shoeScene.children[6].children[1].children[0].material, 'bumpScale', 0, 1).listen();
    fabric.add(shoeScene.children[6].children[1].children[0].material, 'metalness', 0, 1).listen();

    var shiny = gui.addFolder('Shiny Model');
    shiny.add(shoeScene.children[6].children[0].material, 'roughness', 0, 1).listen();
    shiny.add(shoeScene.children[6].children[0].material, 'bumpScale', 0, 1).listen();
    shiny.add(shoeScene.children[6].children[0].material, 'metalness', 0, 1).listen();

    var antiAlias = gui.addFolder('Anti-Alias');
    antiAlias.add(shoeTaaRenderPass, 'sampleLevel', 0, 5, 1);


    var ssao = gui.addFolder('SSAO');

    ssao.add(shoeSsaoPass, 'onlyAO', false).onChange(function (value) {
        shoeSsaoPass.onlyAO = value;
    });
    ssao.add(shoeSsaoPass, 'radius').min(0).max(64).onChange(function (value) {
        shoeSsaoPass.radius = value;
    });
    ssao.add(shoeSsaoPass, 'aoClamp').min(0).max(1).onChange(function (value) {
        shoeSsaoPass.aoClamp = value;
    });
    ssao.add(shoeSsaoPass, 'lumInfluence').min(0).max(1).onChange(function (value) {
        shoeSsaoPass.lumInfluence = value;
    });

}
