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
var shoeComposer;
var shoeRenderPass;
var shoeSsaoPass;
var shoeTaaRenderPass;


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
    var pointLight = new THREE.PointLight(0x999999, 0.05, 11, 2);
    pointLight.position.set(0, -10, 0);//.normalize();
    // pointLight.castShadow = true;
    // //Set up shadow properties for the light;
    // pointLight.shadow.mapSize.width = 1024; // default
    // pointLight.shadow.mapSize.height = 1024; // default
    // pointLight.shadow.camera.near = 1; // default
    // pointLight.shadow.camera.far = 1000 // default
    shoeCamera.add(pointLight);

    // setting a directional light directly over the model to light and cast shadows
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 40, 0);
    directionalLight.castShadow = true;
    // var helper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
    // directionalLight.add(helper)

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default
    directionalLight.shadow.camera = new THREE.OrthographicCamera(-75, 75, 75, -75, 0.5, 1000);
    shoeScene.add(directionalLight);

    // setting a directional light directly over the model to light and cast shadows
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight2.position.set(-10, 40, 0);
    // directionalLight2.castShadow = true;
    shoeScene.add(directionalLight2);
    // var helper2 = new THREE.DirectionalLightHelper(directionalLight2, 5, 0x00ff00);
    // directionalLight2.add(helper2)

    // setting a directional light directly over the model to light and cast shadows
    var directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight3.position.set(10, 40, 0);
    // directionalLight3.castShadow = true;
    shoeScene.add(directionalLight3);

    // var helper3 = new THREE.DirectionalLightHelper(directionalLight3, 5, 0x0000ff);
    // directionalLight3.add(helper3)

    // add the camera so the pointlight following the camera will work
    shoeScene.add(shoeCamera);



    // // setting the ambient light for the model
    // var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    // shoeScene.add(ambientLight);

    // // setting the point light that stays with the camera
    // var pointLight = new THREE.PointLight(0x999999, 0.05, 100, 1);
    // pointLight.position.set(0, 0, -1).normalize();
    // pointLight.castShadow = true;
    // shoeCamera.add(pointLight);

    // // setting a directional light directly over the model to light and cast shadows
    // var directionalLight = new THREE.SpotLight(0xffffff);
    // directionalLight.position.set(0, 25, 0);
    // directionalLight.castShadow = true;

    // //Set up shadow properties for the light
    // directionalLight.shadow.mapSize.width = 512; // default
    // directionalLight.shadow.mapSize.height = 512; // default
    // directionalLight.shadow.camera.near = 0.5; // default
    // directionalLight.shadow.camera.far = 500; // default
    // directionalLight.shadow.camera = new THREE.OrthographicCamera(-75, 75, 75, -75, 0.5, 1000);
    // shoeScene.add(directionalLight);

    // // add the camera so the pointlight following the camera will work
    // shoeScene.add(shoeCamera);

    // setting the plane to which the model's shadow will cast
    var planeGeometry = new THREE.PlaneBufferGeometry(50, 50, 32, 32);
    var planeMaterial = new THREE.ShadowMaterial({
        opacity: 0.2
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "shadowPlane";
    plane.receiveShadow = true;
    plane.rotation.x = -(Math.PI / 36) * 17;
    plane.position.y = -9;
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
    // shoeRenderer.gammaOutput = false;
    shoeRenderer.gammaInput = true;
    shoeRenderer.gammaOutput = true;
    shoeRenderer.shadowMap.enabled = true;
    shoeRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    
    shoeRenderer.physicallyBasedShading = true;    

    shoeContainer.appendChild(shoeRenderer.domElement);

    var envMap = new THREE.CubeTextureLoader().load([
        'pics/xp.png',
        'pics/xn.png',
        'pics/yp.png',
        'pics/yn.png',
        'pics/zp.png',
        'pics/zn.png'
    ])



    // setting up the animation
    animation = new AnimateModel();


    // setting up the loaders to bring in the models and update the progrss bars as well

    // var progresses = [0, 0];

    // var gltfLoader = new THREE.GLTFLoader();

    // gltfLoader.load(json.fab, function (fab) {
    //     fab.scene.children[0].material.roughness = 0.8;
    //     fab.scene.traverse(function (child) {
    //         if (child instanceof THREE.Mesh) {
    //             child.castShadow = true;
    //         }
    //     });

    //     gltfLoader.load(json.shiny, function (shiny) {
    //         shiny.scene;
    //         shiny.scene.children[0].material.roughness = 0.2;
    //         shiny.scene.traverse(function (child) {
    //             if (child instanceof THREE.Mesh) {
    //                 child.castShadow = true;
    //             }
    //         });
    //         fab.scene.rotation.y = Math.PI / 2;
    //         fab.scene.scale.set(modelScale, modelScale, modelScale);
    //         fab.scene.add(shiny.scene);
    //         shoeScene.add(fab.scene);
    //         fab.scene.position.copy(modelInitialPosition);
    //         fab.scene.traverse( function (child){
    //             if (child.isMesh ) {
    //                 child.material.envMap = envMap;
    //             }
    //         });
    //         removeProgress();
    //         animation.setModel(fab.scene);
    //         animation.startRotate();
    //         animation.startFloat();
    //         addGui();

    //     }, function (progress) {
    //         console.log(progress);
    //         var pro = progress.loaded / progress.total;
    //         var proResult = pro - progresses[1];
    //         progresses[1] = pro;
    //         updateProgress(proResult / 2);
    //     }, function (error) {
    //         console.error(error);
    //     });
    // }, function (progress) {
    //     var pro = progress.loaded / progress.total;
    //     var proResult = pro - progresses[0];
    //     progresses[0] = pro;
    //     updateProgress(proResult / 2);
    // }, function (error) {
    //     console.error(error);
    // });


    var progress = console.log;
    var err = console.error;

    mtl_loader = new THREE.MTLLoader();
    var matS = mtl_loader.loadNew('KT4S',json.diffuse, json.normal, json.rough);
    var matF = mtl_loader.loadNew('KT4F',json.diffuse, json.normal, json.rough);

    console.log(matS);
    matS.preload();
    matF.preload();



    var obj_loader = new THREE.OBJLoader();
    obj_loader.setMaterials(matS);
    obj_loader.load(json.shiny,
        function (shiny) {
            shiny.children[0].material.roughness = 0.66;
            shiny.children[0].material.metalness = 0.5;
            shiny.children[0].material.envMap = envMap;
            shiny.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            model = shiny;
            shiny.rotation.y = Math.PI / 2;
            shiny.position.y = -5;
            shiny.scale.set(modelScale, modelScale, modelScale);
            console.log(shiny);

            obj_loader.setMaterials(matF);
            obj_loader.load(json.fab,
                function (fabric) {
                    fabric.children[0].material.envMap = envMap;
                    fabric.children[0].material.roughness = 0.8;
                    fabric.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    })
                    model2 = fabric;
                    shiny.add(fabric)
                    shoeScene.add(shiny);
                    // addGui();
                    animation.startRotate();
                    animation.startFloat();
                    animation.setModel(shiny);
                }, progress, err
            )
        }, progress, err
    )



    shoeComposer = new THREE.EffectComposer(shoeRenderer);



    shoeRenderPass = new THREE.RenderPass(shoeScene, shoeCamera);
    shoeComposer.addPass(shoeRenderPass);




    // Setup SSAO pass
    shoeSsaoPass = new THREE.SSAOPass( shoeScene, shoeCamera );
    shoeSsaoPass.radius = 35;
    shoeSsaoPass.aoClamp = 0.18;
    shoeSsaoPass.lumInfluence = 0.85;
    shoeSsaoPass.renderToScreen = true;

    shoeTaaRenderPass = new THREE.TAARenderPass(shoeScene, shoeCamera);
    shoeTaaRenderPass.unbiased = false;
    shoeTaaRenderPass.sampleLevel = 2;

    
    
    shoeComposer.addPass( shoeSsaoPass );
    shoeComposer.addPass(shoeTaaRenderPass);








    animate();

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
    // ssao.add( postprocessing, 'enabled' );

    ssao.add( shoeSsaoPass, 'onlyAO', false ).onChange( function( value ) { shoeSsaoPass.onlyAO = value; } );
    ssao.add( shoeSsaoPass, 'radius' ).min( 0 ).max( 64 ).onChange( function( value ) { shoeSsaoPass.radius = value; } );
    ssao.add( shoeSsaoPass, 'aoClamp' ).min( 0 ).max( 1 ).onChange( function( value ) { shoeSsaoPass.aoClamp = value; } );
    ssao.add( shoeSsaoPass, 'lumInfluence' ).min( 0 ).max( 1 ).onChange( function( value ) { shoeSsaoPass.lumInfluence = value; } );

    // gui.add( saoPass.params, 'output', {
    //     'Beauty': THREE.SAOPass.OUTPUT.Beauty,
    //     'Beauty+SAO': THREE.SAOPass.OUTPUT.Default,
    //     'SAO': THREE.SAOPass.OUTPUT.SAO,
    //     'Depth': THREE.SAOPass.OUTPUT.Depth,
    //     'Normal': THREE.SAOPass.OUTPUT.Normal
    // } ).onChange( function ( value ) {

    //     saoPass.params.output = parseInt( value );

    // } );
    // gui.add( saoPass.params, 'saoBias', - 1, 1 );
    // gui.add( saoPass.params, 'saoIntensity', 0, 1 );
    // gui.add( saoPass.params, 'saoScale', 0, 10 );
    // gui.add( saoPass.params, 'saoKernelRadius', 1, 100 );
    // gui.add( saoPass.params, 'saoMinResolution', 0, 1 );
    // gui.add( saoPass.params, 'saoBlur' );
    // gui.add( saoPass.params, 'saoBlurRadius', 0, 200 );
    // gui.add( saoPass.params, 'saoBlurStdDev', 0.5, 150 );
    // gui.add( saoPass.params, 'saoBlurDepthCutoff', 0.0, 0.1 );
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
                    // shoeScene.remove(element);
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
    shoeComposer.render();
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
            AMmodel.rotation.y += 0.1;
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
