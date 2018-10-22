module.exports = function (grunt) {

    //project configurations
    grunt.initConfig({
        uglify: {
            options: {
                banner: "/*! <%= grunt.template.today() %> */\n"
            },
            build: {
                src: ["dist/built.js"],
                dest: "dist/threesixty_initialize.js"
            }
        },
        watch: {
            scripts: {
                files: ["js/*"],
                tasks: ["concat","uglify"]
            }
        },
        concat: {
          options: {
            separator: ';',
          },
          dist: {
            src: ['js/three.js','js/OrbitControls.js','js/Detector.js','js/Init.js','js/dat.gui.min.js','js/MTLLoader.js','js/OBJLoader.js','js/EffectComposer.js','js/RenderPass.js','js/ShaderPass.js','js/SAOShader.js','js/CopyShader.js','js/SSAOShader.js','js/SSAOPass.js','js/SSAARenderPass.js','js/TAARenderPass.js'],
            dest: 'dist/built.js',
          },
        },
    });



   
   
    //load uglify plugin
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //create default task
    grunt.registerTask("default", ["uglify"]);

    //watch files
    grunt.loadNpmTasks('grunt-contrib-watch');

    // concat the files
    grunt.loadNpmTasks('grunt-contrib-concat');


};