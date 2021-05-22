const canvas = document.getElementById("screen"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
// const assetsManager = new AssetsManager();
// assetsManager.useDefaultLoadingScreen = false;
var starPool = [];
var backgroundStars = [];
var density = 1000;
var starAmount = 100;
var checkTime = new Date();
var timeCycle = 10;
var cameraPOS = new BABYLON.Vector3(0, 0,-10);
var ambientColor = new BABYLON.Color3(RandomColor(), RandomColor(), RandomColor());
var main_light, light;

var cloudSize = 20000;
var currentSystem;
var step = -200;


// Add your code here matching the playground format

setTimeout(function(){
  const scene = createScene(); //Call the createScene function

  // Register a render loop to repeatedly render the scene
  engine.runRenderLoop(function () {
          scene.render();
  });

  scene.registerBeforeRender(function(){
      var currTime = new Date();
      var sLength = starPool.length;
      if(sLength !== density){
          for(var i = 0; i < density - sLength; i+=1){
              // Create a built-in "sphere" shape.
              var star = BuildStar(false, scene);
              starPool.push(star);
          }
      }

      var newStars = [];
      for(var i = 0; i < starPool.length; i+=1){
          // if(i===0){
          //     console.log(starPool[i]._children[0].material);
          // }
          starPool[i].time += .60;
          // starPool[i]._children[0].material.setFloat("time", stars[i].time);

          if(starPool[i].position.z > 200){
              starPool[i].position.z += -.08;
          } else if (starPool[i].position.z > 100){
              starPool[i].position.z += -.12;
          } else if (starPool[i].position.z > 20){
              starPool[i].position.z += -.15;
          } else {
              starPool[i].position.z += -.18;
          }

          if(starPool[i].position.z < -10){
              starPool[i].dispose();
              continue;
          }
          newStars.push(starPool[i]);
      }
      starPool = newStars;

      //Need to add Color lerping
      if((currTime.getTime() - checkTime.getTime()) / 1000 > timeCycle){
          ambientColor = new BABYLON.Color3(RandomColor(), RandomColor(), RandomColor());
          checkTime = currTime;
      }
      scene.fogColor = BABYLON.Color3.Lerp(scene.fogColor, ambientColor, 0.0025);
      light.diffuse = BABYLON.Color3.Lerp(light.diffuse, ambientColor, 0.0025);

      if(currentSystem.position.z <= -cloudSize - 300 ){
        // step *= -1;
        currentSystem.dispose();
        currentSystem = GetSystem(scene);
      }


      currentSystem.position.z += step;
  });

}, 4000);



function createScene(){
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(.1,.1,.1);
  scene.autoClear = true
  // Parameters : name, position, scene
  var camera = new BABYLON.UniversalCamera("UniversalCamera", cameraPOS, scene);
  camera.maxZ = 1000000;
  // Targets the camera to a particular position. In this case the scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // main_light = new BABYLON.HemisphericLight('color_light', new BABYLON.Vector3(0,0,-35), scene);
  // main_light.intensity = .6;
  // main_light.groundColor = new BABYLON.Color3(0, 0, 0);
  // main_light.range = 1000000;

  light = new BABYLON.HemisphericLight('color_light', new BABYLON.Vector3(0,0,-35), scene);
  light.intensity = 1.2;
  light.diffuse = ambientColor;
  light.groundColor = new BABYLON.Color3(0, 0, 0);

  for(var i = 0; i < density; i+=1){
      // Create a built-in "sphere" shape.
      var star = BuildBackgroundStar();
      backgroundStars.push(star);
  }

  for(var i = 0; i < density; i+=1){
      // Create a built-in "sphere" shape.
      var star = BuildStar(true, scene);
      starPool.push(star);
  }

  currentSystem = GetSystem(scene);
  return scene;
}






function RandomNumberBetween(max){
    return Math.random() * (max - -max + 1) + -max;
}

function RandomHeightDisplacement(max){
    let runs = 5;
    let hmap = 0;
    for(var i = 0; i < runs; i+=1){
        hmap += RandomNumberBetween(max);
    }
    return hmap / runs;
}

function RandomDepth(){
    return Math.random() * (500 - 10 + 1) + 10;
}

function RandomColor(){
    return Math.random();
}

function BuildStar(initial, scene){
    var starBuffer = 200
    var starObject = new BABYLON.Mesh("dummy", scene);
    var star = BABYLON.MeshBuilder.CreateDisc("disc", {
            radius: 0.25
        }, scene);
    starObject._color = new BABYLON.Vector3(RandomColor(), RandomColor(), RandomColor())
    // Move the sphere upward 1/2 of its height.
    if(initial){
        var starPos = new BABYLON.Vector3(RandomNumberBetween($('body').width()/3), RandomNumberBetween(($('body').height() + starBuffer * 2) / 10), RandomDepth());
    } else {
        var starPos = new BABYLON.Vector3(RandomNumberBetween($('body').width()/3), RandomNumberBetween(($('body').height() + starBuffer * 2) / 10), 500);
    }
    // star.material = new BABYLON.ShaderMaterial("star_mat_" + Math.random(), scene, {
    //         vertexElement: "vertexShaderCode",
    //         fragmentElement: "fragmentShaderCode",
    //     },
    //     {
    //         attributes: ["position", "normal", "uv", "time", "color"],
    //         uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
    // });
    starObject.time = starPos.z;
    // star.material.setFloat("time", starObject.time);
    // star.material.setVector3("color", starObject._color);
    //star.material = new BABYLON.StandardMaterial("star_mat_" + Math.random(), scene)
    //star.material.diffuseColor = color;
    starObject.position = starPos;
    starObject.addChild(star);

    star.position = new BABYLON.Vector3.Zero;
    starObject.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    return starObject;
}

function BuildBackgroundStar(scene){
    var starBuffer = 200
    var starObject = new BABYLON.Mesh("dummy", scene);
    var star = BABYLON.MeshBuilder.CreateDisc("disc", {
            radius: 0.25
        }, scene);
    var color = new BABYLON.Color3(RandomColor(), RandomColor(), RandomColor())
    //Need to build better random displacement for height
    var starPos = new BABYLON.Vector3(RandomNumberBetween(($('body').width())), RandomHeightDisplacement(($('body').height() / 100 + starBuffer * 2) / 20), 500);
    star.material = new BABYLON.StandardMaterial("star_mat_" + Math.random(), scene)
    star.material.diffuseColor = color;
    starObject.position = starPos;
    starObject.addChild(star);

    star.position = new BABYLON.Vector3.Zero;
    starObject.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    return starObject;
}

function GetSystem(scene){
  let system = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
  system.position.x = getRandomArbitrary(-1000, 1000);//((Math.random() >= .5) ? 1 : -1) * getRandomArbitrary(500, 1000);
  system.position.y = getRandomArbitrary(-1000, 1000);
  system.position.z = 500000;

  childSpheres = []

  system.visibility = false;
  var fogTextures = [
    new BABYLON.Texture("\\public\\imgs\\smoke_1.png", scene),
    new BABYLON.Texture("\\public\\imgs\\smoke_15.png", scene)
  ];

  // var system = BABYLON.ParticleHelper.CreateFromSnippetAsync("_BLANK", scene, false).then(system => {
  //
  //   system.minEmitBox = new BABYLON.Vector3(-25, 2, -25); // Starting all from
  //   system.maxEmitBox = new BABYLON.Vector3(25, 2, 25); // To...
  //   system.particleTexture = fogTexture.clone();
  //   system.emitter = sphere;
  //
  // });

  var systemColor = new BABYLON.Color3(RandomColor(), RandomColor(), RandomColor());
  // console.log(systemColor.r);
  // console.log(systemColor.r + (30/360));
  // console.log(systemColor.r + (-30/360));
  // console.log((systemColor.r + (30/360)) % 1);

  systemColors = genColors(systemColor);

  for(var i = 0; i < 5; i+=1){
    cSphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
    cSphere.parent = system;
    cSphere.locallyTranslate(new BABYLON.Vector3(
      getRandomArbitrary(-cloudSize / 2, cloudSize / 2),
      getRandomArbitrary(-cloudSize / 2, cloudSize / 2),
      getRandomArbitrary(-cloudSize / 2, cloudSize / 2)
    ));
    cSphere.visibility = false;
    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    // var cLight = new BABYLON.HemisphericLight("cLight" + i, new BABYLON.Vector3(0, 0, 0), scene);
    //
    // // Default intensity is 1. Let's dim the light a small amount
    // cLight.intensity = 1;
    // cLight.parent = cSphere;
    // cLight.position = new BABYLON.Vector3(0, 0, 0);
    // cLight.isLocal = true;
    // cLight.diffuse = systemColors[i][0];
    // cLight.groundColor = new BABYLON.Color3(0, 0, 0);
    childSpheres.push(cSphere);
  }




  for(var i = 0; i < 5; i+=1){

    let radius = cloudSize / 5 * getRandomArbitrary(1, 5);

    if (true && BABYLON.GPUParticleSystem.IsSupported) {
        particleSystem = new BABYLON.GPUParticleSystem("particles", { capacity: 50000 }, scene);
        particleSystem.activeParticleCount = radius * 4;
        particleSystem.manualEmitCount = particleSystem.activeParticleCount;

    } else {
        particleSystem = new BABYLON.ParticleSystem("particles", cloudSize / 5 , scene);
        particleSystem.manualEmitCount = particleSystem.getCapacity();
    }

    particleSystem.isLocal = true;
    var sphereEmitter = particleSystem.createSphereEmitter(radius);
    let rando = Math.random();
    sphereEmitter.radiusRange = (rando < .5) ? .5 : rando;
    // let rando = getRandomArbitrary(0, radius/2);
    // particleSystem.minEmitBox = new BABYLON.Vector3(-rando,-rando,-2000); // Starting all from
    // particleSystem.maxEmitBox = new BABYLON.Vector3(rando,rando,2000); // To...
    var textureValue = (Math.random() < .5) ? 0 : 1;
    // console.log(textureValue);
    particleSystem.particleTexture = fogTextures[textureValue].clone();
    particleSystem.emitter = childSpheres[i];

    // particleSystem.color1 = systemColors[i][0];
    // particleSystem.color2 = systemColors[i][1];

    particleSystem.color1 = brighten(systemColors[i][0]);
    particleSystem.color2 = brighten(systemColors[i][1]);

    // var cLight = scene.getNodeByName("cLight" + [i]);
    // cLight.range = radius;
    particleSystem.colorDead = new BABYLON.Color4(0.9, 0.9, 0.9, 0.1);
    particleSystem.minSize = .5;
    particleSystem.maxSize = 200;
    particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
    particleSystem.emitRate = 50000;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.addVelocityGradient(0, 0, 0);
    // particleSystem.direction1 = new BABYLON.Vector3(0, 0, 0);
    // particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
    particleSystem.minAngularSpeed = -2;
    particleSystem.maxAngularSpeed = 2;
    particleSystem.minEmitPower = .5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.0025//0.0009;
    particleSystem.preWarmCycles = 100;
    particleSystem.preWarmStepOffset = 5;
    particleSystem.start();
  }

  return system;
}

function brighten(color){
  let mod = 1.5;
  color.r *= mod;
  color.g *= mod;
  color.b *= mod;
  return color;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
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

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        engine.resize();
});
