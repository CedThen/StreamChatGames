import * as THREE from "three";
import stormcloud from "../imgs/stormcloud.png";
import React from "react";
const MontJson = require("../Fonts/Montserrat_Regular.json");

let camera,
  scene,
  renderer,
  cloudParticles = [],
  flash,
  ambient,
  directionalLight,
  rainCount = 100,
  rainDrop,
  rain = [];

class ThreeJsBg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animType: this.props.animType,
      currentWords: {}
    };
  }
  componentDidMount() {
    this.init();
    this.mount.appendChild(renderer.domElement);
  }

  componentWillUnmount() {
    this.disposeScene();
  }

  disposeScene = () => {
    camera = null;
    cloudParticles = [];
    ambient = null;
    directionalLight = null;
    rainDrop = null;
    rain = [];
    scene.dispose();
    this.mount.removeChild(renderer.domElement);
  };

  init = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, 2, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);
    directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);
    //flash
    flash = new THREE.PointLight(0x062d89, 30, 600, 1.7);
    flash.position.set(200, 300, 100);

    //renderer
    renderer = new THREE.WebGLRenderer();
    scene.fog = new THREE.FogExp2(0x11111f, 0.002);
    renderer.setClearColor(scene.fog.color);
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.state.animType === "homePage") {
      this.letterFallInit();
    }
    //cloud bg
    let loader = new THREE.TextureLoader();
    loader.load(stormcloud, function(texture) {
      let cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
      let cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true
      });
      for (let p = 0; p < 25; p++) {
        let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(Math.random() * 800 - 400, 500, Math.random() * 500 - 450);
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.6;
        cloudParticles.push(cloud);

        scene.add(cloud);
      }
    });
    this.animate();
  };

  animate = () => {
    //rain anim
    if (this.state.animType === "homePage") {
      this.letterFallAnim();
    }
    if (this.state.animType === "madlibs") {
      this.wordFall();
    }

    cloudParticles.forEach(p => {
      p.rotation.z -= 0.0005;
    });
    if (Math.random() > 0.9) {
      scene.add(flash);
    } else {
      scene.remove(flash);
    }
    if (Math.random() > 0.93 || flash.power > 100) {
      if (flash.power < 100)
        flash.position.set(Math.random() * 400, 300 + Math.random() * 200, 100);
      flash.power = 50 + Math.random() * 500;
    }

    requestAnimationFrame(this.animate);
    renderer.render(scene, camera);
  };

  letterFallAnim = () => {
    rain.forEach(p => {
      p.velocity -= 0.01;
      p.position.y += p.velocity;
      if (p.position.y < 0) {
        p.position.y = Math.random() * 300 + 500;
        p.position.x = Math.random() * 800 - 400;
        p.position.z = Math.random() * 500 - 450;
        p.velocity = 0;
      }
    });
  };

  wordFall = () => {
    //runs during each frame of animate
    if (!this.state.currentWords[this.props.msg]) {
      //not a currently falling word, create and add to scene
      console.log("making new word geo");
      let fontL = new THREE.FontLoader();
      let font = fontL.parse(MontJson);

      let fontGeo = new THREE.TextBufferGeometry(this.props.msg, {
        font: font,
        size: 7,
        height: 1,
        curveSegments: 12
      });
      let fontMat = new THREE.MeshLambertMaterial({
        color: 0xa6d8d4,
        transparent: true
      });
      let wordDrop = new THREE.Mesh(fontGeo, fontMat);
      wordDrop.position.set(
        Math.random() * 800 - 400,
        Math.random() * 800,
        Math.random() * 500 - 450
      );
      wordDrop.rotation.x = 1.16;
      wordDrop.rotation.y = -0.12;
      wordDrop.material.opacity = 0.6;
      wordDrop.velocity = {};
      wordDrop.velocity = -1;

      let updatedWordObj = this.state.currentWords;
      updatedWordObj[this.props.msg] = wordDrop;
      console.log("updated wordd obj: ", updatedWordObj);
      this.setState({ currentWords: updatedWordObj });

      scene.add(wordDrop);
    } else {
      for (let word in this.state.currentWords) {
        this.state.currentWords[word].velocity -= 0.01;
        this.state.currentWords[word].position.y += this.state.currentWords[word].velocity;
        if (this.state.currentWords[word].position.y < 0) {
          scene.remove(this.state.currentWords[word]);
          let newCurrentWords = this.state.currentWords;
          delete newCurrentWords[word];
          this.setState(newCurrentWords);
        }
      }
    }
  };

  letterFallInit = () => {
    let fontL = new THREE.FontLoader();
    let font = fontL.parse(MontJson);

    function randomLet() {
      return Math.floor(Math.random() * 36)
        .toString(36)
        .toUpperCase();
    }

    for (let r = 0; r < rainCount; r++) {
      let randomLetter = randomLet();
      let fontGeo = new THREE.TextBufferGeometry(randomLetter, {
        font: font,
        size: 7,
        height: 1,
        curveSegments: 12
      });
      let fontMat = new THREE.MeshLambertMaterial({
        color: 0xa6d8d4,
        transparent: true
      });
      rainDrop = new THREE.Mesh(fontGeo, fontMat);
      rainDrop.position.set(
        Math.random() * 800 - 400,
        Math.random() * 800,
        Math.random() * 500 - 450
      );
      rainDrop.rotation.x = 1.16;
      rainDrop.rotation.y = -0.12;
      rainDrop.material.opacity = 0.6;
      rainDrop.velocity = {};
      rainDrop.velocity = -1;
      rain.push(rainDrop);
      scene.add(rainDrop);
    }
  };

  render() {
    return <div className={this.props.cssClass} ref={ref => (this.mount = ref)}></div>;
  }
}

export default ThreeJsBg;
