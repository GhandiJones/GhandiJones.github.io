
      var cameraPOS = new BABYLON.Vector3(0, 0,-10);
      var cloudSize = 20000;

      var colorTime = 0;
      var colorTimePassed;
      var colorSwapRate = 10;
      var colorStore = {
        orig: [],
        new: []
      }
      var colorLerpTime;
      var isColorLerping = false;
      var dirTime = 0;
      var dirSwapRate = 15;
      var directionStore = {
        orig: {},
        new: {}
      }
      var dirLerpTime;
      var isDirectionalLerping = false;

      const canvas = document.getElementById("screen"); // Get the canvas element
      const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine


      const scene = createScene(); //Call the createScene function

      // Register a render loop to repeatedly render the scene
      engine.runRenderLoop(function () {
              scene.render();
      });

      // Watch for browser/canvas resize events
      window.addEventListener("resize", function () {
              engine.resize();
      });

      var currentSystem;
      var systemBody;
      // var step = -200;
      var testTime = 0;
      //((Math.random() < .5) ? -1 : 1) * getRandomArbitrary(0, 2)
      var rotationDirection = new BABYLON.Vector3(((Math.random() < .5) ? -1 : 1) * getRandomArbitrary(0, 2), ((Math.random() < .5) ? -1 : 1) * getRandomArbitrary(0, 2), 3);
      var rotationAngle = ((Math.random() < .5) ? -1 : 1) * 0.0008;
      scene.registerBeforeRender(function(){

        systemBody.rotate(rotationDirection, rotationAngle, BABYLON.Space.WORLD);

        testTime += engine.getDeltaTime();
        colorTime += engine.getDeltaTime();
        colorLerpTime += engine.getDeltaTime();
        dirTime += engine.getDeltaTime();
        dirLerpTime += engine.getDeltaTime();

        if(testTime >= 1000){
          testTime = 0;
        } else {

        }

        if(!isColorLerping && (colorTime / 1000) >= colorSwapRate){
          let systemColors = genColors(BabylonRandomColor3());
          colorStore.new = systemColors;
          isColorLerping = true;
          colorLerpTime = 0;
        }

        if(isColorLerping){
          let lerpRate = colorSwapRate / 2;
          let lerpCheck = (colorLerpTime / 1000) / lerpRate;
          lerpCheck = (lerpCheck < 1) ? lerpCheck : 1;
          // console.log(lerpCheck);
          currentSystem.color1 = brighten(BABYLON.Color3.Lerp(colorStore.orig[0][0], colorStore.new[0][0], lerpCheck));
          currentSystem.color2 = brighten(BABYLON.Color3.Lerp(colorStore.orig[4][0], colorStore.new[4][0], lerpCheck));
          if(colorLerpTime / 1000 >= lerpRate){
              colorTime = 0;
              isColorLerping = false;
              colorStore.orig = colorStore.new;
          }
        }

        if(!isDirectionalLerping && (dirTime / 1000) >= dirSwapRate){
          directionStore.new.dir1 = BabylonRandomVector3();
          directionStore.new.dir2 = BabylonRandomVector3();
          isDirectionalLerping = true;
          dirLerpTime = 0;
        }

        if(isDirectionalLerping){
          let lerpRate = dirSwapRate / 4;
          let lerpCheck = (dirLerpTime / 1000) / lerpRate;
          lerpCheck = (lerpCheck < 1) ? lerpCheck : 1;
          currentSystem.direction1 = brighten(BABYLON.Vector3.Lerp(directionStore.orig.dir1, directionStore.new.dir1, lerpCheck));
          currentSystem.direction2 = brighten(BABYLON.Vector3.Lerp(directionStore.orig.dir2, directionStore.new.dir2, lerpCheck));
          if(dirLerpTime / 1000 >= lerpRate){
              currentSystem.noiseStrength = BabylonRandomVector3(3);
              dirTime = 0;
              isDirectionalLerping = false;
              directionStore.orig = directionStore.new;
          }
        }

        // currentSystem.position.x = 5 * Math.cos(engine.getDeltaTime());
        // currentSystem.position.y = 5 * Math.sin(engine.getDeltaTime());

        // if(sphere.position.z > 120000 + cloudSize * 2){
        //   step *= -1;
        // }
        // if(currentSystem.position.z <= -cloudSize - 300 ){
        //   // step *= -1;
        //   currentSystem.dispose();
        //   currentSystem = GetSystem(scene);
        // }
        //
        //
        // currentSystem.position.z += step;

        //console.log(sphere.position.z);

      });


      function createScene() {
        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(.1,.1,.1);
        scene.autoClear = true;
        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.UniversalCamera("UniversalCamera", cameraPOS, scene);
        camera.maxZ = 250000;
        // Targets the camera to a particular position. In this case the scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
        // light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.groundColor = new BABYLON.Color3(0, 0, 0);
        // Default intensity is 1. Let's dim the light a small amount
        light.range = 500000;
        light.intensity = .7;

        // Our built-in 'sphere' shape.
        currentSystem = GetSystem(scene);

        return scene;
    };

    function GetSystem(scene){
      systemBody = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
      // system.position.x = getRandomArbitrary(-1000, 1000);//((Math.random() >= .5) ? 1 : -1) * getRandomArbitrary(500, 1000);
      // system.position.y = getRandomArbitrary(-1000, 1000);
      systemBody.position = BABYLON.Vector3.Zero();
      systemBody.position.z = -5;

      // childSpheres = []

      systemBody.visibility = false;
      var fogTextures = [
        new BABYLON.Texture("\\public\\imgs\\smoke_1.png", scene),
        new BABYLON.Texture("\\public\\imgs\\smoke_15.png", scene)
      ];
      var starTexture = new BABYLON.Texture("public/imgs/star.png", scene);

      systemColors = genColors(BabylonRandomColor3());
      colorStore.orig = systemColors;
      // Create a particle system
      var particleSystem = new BABYLON.ParticleSystem("main_particles", 2000, scene);

      //Texture of each particle
      // particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);

      // Where the particles come from
      particleSystem.emitter = systemBody;//BABYLON.Vector3.Zero(); // the starting location
      particleSystem.isLocal = true;
      // Colors of all particles
      particleSystem.color1 = brighten(systemColors[0][0]);//new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
      particleSystem.color2 = brighten(systemColors[4][0]);//new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
      particleSystem.colorDead = new BABYLON.Color4(0.1, 0.1, 0.1, 1);

      // Size of each particle (random between...
      particleSystem.minSize = 0.01;
      particleSystem.maxSize = 0.5;

      particleSystem.addSizeGradient(0, 0.01); //size at start of particle lifetime
      particleSystem.addSizeGradient(0.01, 0.05); //size at end of particle lifetime

      // Life time of each particle (random between...
      particleSystem.minLifeTime = .5;
      particleSystem.maxLifeTime = 2;

      // Emission rate
      particleSystem.emitRate = 50000;

      particleSystem.particleTexture = starTexture.clone();//fogTextures[1].clone();
      /******* Emission Space ********/
      // particleSystem.createBoxEmitter(new BABYLON.Vector3(-5, -5, -5), new BABYLON.Vector3(5, 5, 5), new BABYLON.Vector3(-1, -2, -2.5), new BABYLON.Vector3(1, 2, 2.5));
      // particleSystem.direction1 = new BABYLON.Vector3(0, 3,-3);
      // particleSystem.direction2 = new BABYLON.Vector3(0, -3, -3);
      // particleSystem.minEmitBox = new BABYLON.Vector3(-6, -.04, 0);
      // particleSystem.maxEmitBox = new BABYLON.Vector3(6, .04, 0);
      // particleSystem.createSphereEmitter(6);
      var sphereEmitter = particleSystem.createDirectedSphereEmitter(6, new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, -10));
      directionStore.orig.dir1 = particleSystem.direction1;
      directionStore.orig.dir2 = particleSystem.direction2;
      // Speed
      particleSystem.minEmitPower = .025;
      particleSystem.maxEmitPower = .5;
      particleSystem.updateSpeed = 0.005;
      particleSystem.minAngularSpeed = -2;
      particleSystem.maxAngularSpeed = 2;

      var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
      noiseTexture.animationSpeedFactor = 5;
      noiseTexture.persistence = .25;
      noiseTexture.brightness = 1;
      noiseTexture.octaves = 5;

      particleSystem.noiseTexture = noiseTexture;
      particleSystem.noiseStrength = new BABYLON.Vector3(0, 0, -2);

      particleSystem.preWarmCycles = 100;
      particleSystem.preWarmStepOffset = 5;
      // Start the particle system
      particleSystem.start();

      // var systemEmitter = BABYLON.ParticleHelper.CreateFromSnippetAsync("_BLANK", scene, false).then(system => {
      //
      //   system.minEmitBox = new BABYLON.Vector3(-25, 2, -25); // Starting all from
      //   system.maxEmitBox = new BABYLON.Vector3(25, 2, 25); // To...
      //   system.particleTexture = fogTextures[1].clone();
      //   system.emitter = system;
      //
      // });

      // var systemColor = new BABYLON.Color3(RandomColor(), RandomColor(), RandomColor());
      // // console.log(systemColor.r);
      // // console.log(systemColor.r + (30/360));
      // // console.log(systemColor.r + (-30/360));
      // // console.log((systemColor.r + (30/360)) % 1);
      //
      // systemColors = genColors(systemColor);
      //
      // for(var i = 0; i < 5; i+=1){
      //   cSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1, segments: 32}, scene);
      //   cSphere.parent = system;
      //   cSphere.locallyTranslate(new BABYLON.Vector3(
      //     getRandomArbitrary(-cloudSize / 2, cloudSize / 2),
      //     getRandomArbitrary(-cloudSize / 2, cloudSize / 2),
      //     getRandomArbitrary(-cloudSize / 2, cloudSize / 2)
      //   ));
      //   // cSphere.visibility = false;
      //   // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
      //   // var cLight = new BABYLON.HemisphericLight("cLight" + i, new BABYLON.Vector3(0, 0, 0), scene);
      //   //
      //   // // Default intensity is 1. Let's dim the light a small amount
      //   // cLight.intensity = 100;
      //   // cLight.parent = cSphere;
      //   // cLight.position = new BABYLON.Vector3(0, 0, 0);
      //   // cLight.isLocal = true;
      //   // cLight.diffuse = systemColors[i][0];
      //   childSpheres.push(cSphere);
      // }
      //
      //
      //
      //
      // for(var i = 0; i < 5; i+=1){
      //
      //   let radius = cloudSize / 5 * getRandomArbitrary(1, 5);
      //
      //   if (true && BABYLON.GPUParticleSystem.IsSupported) {
      //       particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, scene);
      //       particleSystem.activeParticleCount = radius * 4;
      //       particleSystem.manualEmitCount = particleSystem.activeParticleCount;
      //
      //   } else {
      //       particleSystem = new BABYLON.ParticleSystem("particles", cloudSize / 5 , scene);
      //       particleSystem.manualEmitCount = particleSystem.getCapacity();
      //   }
      //
      //   particleSystem.isLocal = true;
      //   var sphereEmitter = particleSystem.createSphereEmitter(radius);
      //   let rando = Math.random();
      //   sphereEmitter.radiusRange = (rando < .5) ? .5 : rando;
      //   // let rando = getRandomArbitrary(0, radius/2);
      //   // particleSystem.minEmitBox = new BABYLON.Vector3(-rando,-rando,-2000); // Starting all from
      //   // particleSystem.maxEmitBox = new BABYLON.Vector3(rando,rando,2000); // To...
      //   var textureValue = (Math.random() < .5) ? 0 : 1;
      //   // console.log(textureValue);
      //   particleSystem.particleTexture = fogTextures[textureValue].clone();
      //   particleSystem.emitter = childSpheres[i];
      //
      //
      //
      //   particleSystem.color1 = brighten(systemColors[i][0]);
      //   particleSystem.color2 = brighten(systemColors[i][1]);
      //
      //   // var coreMat = new BABYLON.StandardMaterial("coreMat" + i, scene)
      //   // coreMat.emissiveColor = systemColors[i][0];
      //   // // Assign core material to sphere
      //   // childSpheres[i].material = coreMat;
      //   // childSpheres[i].scaling = new BABYLON.Vector3(radius, radius, radius);
      //
      //   // var cLight = scene.getNodeByName("cLight" + [i]);
      //   // cLight.range = radius;
      //   // console.log(cLight);
      //
      //   particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
      //   particleSystem.minSize = .5;
      //   particleSystem.maxSize = 200;
      //   particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
      //   particleSystem.emitRate = 50000;
      //   particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
      //   particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
      //   particleSystem.addVelocityGradient(0.01, 0.01, 0.01);
      //   particleSystem.addVelocityGradient(-0.01, -0.01, -0.01);
      //   // particleSystem.direction1 = new BABYLON.Vector3(1, 1, 1);
      //   // particleSystem.direction2 = new BABYLON.Vector3(-1, -1, -1);
      //   particleSystem.minAngularSpeed = -2;
      //   particleSystem.maxAngularSpeed = 2;
      //   particleSystem.minEmitPower = 100;
      //   particleSystem.maxEmitPower = 500;
      //   particleSystem.updateSpeed = 0.0025//0.0009;
      //   var noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
      //   noiseTexture.animationSpeedFactor = 5;
      //   noiseTexture.persistence = .5;
      //   noiseTexture.brightness = 2;
      //   noiseTexture.octaves = 3;
      //
      //   particleSystem.noiseTexture = noiseTexture;
      //   particleSystem.noiseStrength = new BABYLON.Vector3(10000, 10000, 10000);
      //
      //   particleSystem.start();
      // }

      return particleSystem;
    }


    function brighten(color){
      let mod = 1.25;
      color.r *= mod;
      color.g *= mod;
      color.b *= mod;
      return color;
    }

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function BabylonRandomVector3(max){
      max = max || 10;
      return new BABYLON.Vector3(getRandomArbitrary(-max, max), getRandomArbitrary(-max, max), getRandomArbitrary(-max, max));
    }

    function BabylonRandomColor3(){
      return new BABYLON.Color3(RandomColor(), RandomColor(), RandomColor());
    }

    function RandomColor(){
        return Math.random();
    }

    function genColors(mainCol){
      var sysColors = [];

      for(var i = 0; i < 5; i+=1){
        let sysCol = colorAnalagousPicker(mainCol, i - 2)
        sysColors.push(sysCol);
      }
      return sysColors;
    }

    function colorAnalagousPicker(color, variationDeg){
      // Based my varition around formula from https://stackoverflow.com/questions/14095849/calculating-the-analogous-color-with-python/14116553
      var colors = [
          new BABYLON.Color4(
            (color.r + ((variationDeg * 30) / 360)) % 1,
            (color.g + ((variationDeg * 30) / 360)) % 1,
            (color.b + ((variationDeg * 30) / 360)) % 1,
            0.1
          ),
          new BABYLON.Color4(
            (color.r + ((variationDeg * (30 + (Math.sign(variationDeg) + 15) )) / 360)) % 1,
            (color.g + ((variationDeg * (30 + (Math.sign(variationDeg) + 15) )) / 360)) % 1,
            (color.b + ((variationDeg * (30 + (Math.sign(variationDeg) + 15) )) / 360)) % 1,
            0.15
          )
      ]
      return colors;
    }


      // function createScene() {
      //     var scene = new BABYLON.Scene(engine);
      //
      //     // Setup environment
      //     var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 1.3, 20, new BABYLON.Vector3(0, 0, 0), scene);
      //     camera.attachControl(canvas, true);
      //     camera.wheelPrecision = 100;
      //
      //     var fountain = BABYLON.Mesh.CreateBox("foutain", .01, scene);
      //     fountain.visibility = 0;
      //
      //      // Ground
      //     var ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
      //     ground.position = new BABYLON.Vector3(0, 0, 0);
      //     ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
      //
      //     ground.material = new BABYLON.StandardMaterial("groundMat", scene);
      //     ground.material.backFaceCulling = false;
      //     ground.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);
      //
      //     // Create a particle system
      //     var particleSystem;
      //     var useGPUVersion = false;
      //
      //     var fogTexture = new BABYLON.Texture("https://raw.githubusercontent.com/aWeirdo/Babylon.js/master/smoke_15.png", scene);
      //
      //     var createNewSystem = function() {
      //         if (particleSystem) {
      //             particleSystem.dispose();
      //         }
      //
      //         if (useGPUVersion && BABYLON.GPUParticleSystem.IsSupported) {
      //             particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, scene);
      //             particleSystem.activeParticleCount = 15000;
      //             particleSystem.manualEmitCount = particleSystem.activeParticleCount;
      //             particleSystem.minEmitBox = new BABYLON.Vector3(-50, 2, -50); // Starting all from
      //             particleSystem.maxEmitBox = new BABYLON.Vector3(50, 2, 50); // To..
      //
      //         } else {
      //             particleSystem = new BABYLON.ParticleSystem("particles", 2500 , scene);
      //             particleSystem.manualEmitCount = particleSystem.getCapacity();
      //             particleSystem.minEmitBox = new BABYLON.Vector3(-25, 2, -25); // Starting all from
      //             particleSystem.maxEmitBox = new BABYLON.Vector3(25, 2, 25); // To...
      //         }
      //
      //
      //         particleSystem.particleTexture = fogTexture.clone();
      //         particleSystem.emitter = fountain;
      //
      // 	    particleSystem.color1 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.1);
      //         particleSystem.color2 = new BABYLON.Color4(.95, .95, .95, 0.15);
      //         particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
      // 	    particleSystem.minSize = 3.5;
      //         particleSystem.maxSize = 5.0;
      //         particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
      //         particleSystem.emitRate = 50000;
      //         particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
      //         particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
      //         particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
      //         particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
      //         particleSystem.minAngularSpeed = -2;
      // 	    particleSystem.maxAngularSpeed = 2;
      //         particleSystem.minEmitPower = .5;
      //         particleSystem.maxEmitPower = 1;
      //         particleSystem.updateSpeed = 0.005;
      //
      //         particleSystem.start();
      //     }
      //
      //     createNewSystem();
      //
      //     return scene;
      // }
