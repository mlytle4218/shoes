// Setting global variables
// var connectingElement = "product-canvas";
// var cameraDistance = 50;
// var modelInitialPosition = new THREE.Vector3(0, -4, 0);
// var shoeRenderer;
// var shoeCamera;
// var shoeScene;
// var shoeContainer;
// var animation;
// var modelScale = .8;
var composer;
var renderer,
    scene,
    camera,
    myCanvas = document.getElementById('product-canvas');


function loadModelOntoPage(json) {




    shoeContainer = document.getElementById('product-canvas');

    //RENDERER
    renderer = new THREE.WebGLRenderer({
        canvas: myCanvas[0],
        antialias: true
    });
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(myCanvas.clientWidth, myCanvas.clientHeight);
    0
    //CAMERA
    camera = new THREE.PerspectiveCamera(35, myCanvas.clientWidth / myCanvas.clientHeight, 0, 10000);

    //SCENE
    scene = new THREE.Scene();

    //LIGHTS
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light2);

    var material = new THREE.MeshLambertMaterial({
        color: 0xff0000
    });

    var geometry = new THREE.BoxBufferGeometry(100, 100, 100, 10, 10, 10);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -5;
    mesh.position.x = -5;
    scene.add(mesh);


    var geometry2 = new THREE.SphereGeometry(50, 20, 20);
    var mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.z = -5;
    mesh2.position.x = 5;
    scene.add(mesh2);


    var geometry3 = new THREE.PlaneGeometry(10000, 10000, 100, 100);
    var mesh3 = new THREE.Mesh(geometry3, material);
    mesh3.rotation.x = -90 * Math.PI / 180;
    mesh3.position.y = -5;
    scene.add(mesh3);


    //COMPOSER

    composer = new THREE.EffectComposer(renderer);

    var renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    var sepiaPass = new THREE.ShaderPass(THREE.SepiaShader);
    composer.addPass(sepiaPass);

    var glitchPass = new THREE.GlitchPass(0);
    composer.addPass(glitchPass);


    //custom shader pass
    var myEffect = {
        uniforms: {
            "tDiffuse": {
                value: null
            },
            "amount": {
                value: 1.0
            }
        },
        vertexShader: [
            "varying vec2 vUv;",
            "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
            "}"
        ].join("\n"),
        fragmentShader: [
            "uniform float amount;",
            "uniform sampler2D tDiffuse;",
            "varying vec2 vUv;",
            "void main() {",
            "vec4 color = texture2D( tDiffuse, vUv );",
            "vec3 c = color.rgb;",
            "color.r = c.r * 2.0;",
            "color.g = c.g / 1.2;",
            "color.b = c.b;",
            "gl_FragColor = vec4( color.rgb , color.a );",
            "}"
        ].join("\n")
    }

    var customPass = new THREE.ShaderPass(myEffect);
    customPass.renderToScreen = true;
    composer.addPass(customPass);

    //RENDER LOOP
    render();




}

function render() {

    renderer.render(scene, camera);
    composer.render();

    requestAnimationFrame(render);
}