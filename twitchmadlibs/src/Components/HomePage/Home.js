import React from "react";
import "./Home.scss";
import * as THREE from "three";
import stormcloud from "../../imgs/stormcloud.png";
import { NavLink } from "react-router-dom";
import Navigation from "../Navbar/Navigation.js";
const MontJson = require("../../Fonts/Montserrat_Regular.json");
// const words = require("an-array-of-english-words");
let camera,
  scene,
  renderer,
  cloudParticles = [],
  flash,
  ambient,
  directionalLight,
  rainCount = 100,
  rainDrop,
  rain = [],
  fontMat,
  fontL,
  fontGeo,
  animateID = animate => {
    return requestAnimationFrame(animate);
  };

class Home extends React.Component {
  componentDidMount() {
    this.letterRain();
  }

  componentWillUnmount() {
    cancelAnimationFrame(animateID);
    camera = null;
    // renderer = null;
    cloudParticles = [];
    // flash = null;
    ambient = null;
    directionalLight = null;
    rainDrop = null;
    rain = [];
    fontL = null;
    scene.dispose();
    fontGeo.dispose();
    fontMat.dispose();
    this.mount.removeChild(renderer.domElement);
    console.log("scene disposed");
  }

  letterRain = () => {
    init();
    this.mount.appendChild(renderer.domElement);

    function init() {
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

      fontL = new THREE.FontLoader();
      let font = fontL.parse(MontJson);

      // function randomWord() {
      //   return words[Math.floor(Math.random() * words.length)];
      // }

      function randomLet() {
        return Math.floor(Math.random() * 36)
          .toString(36)
          .toUpperCase();
      }

      for (let r = 0; r < rainCount; r++) {
        let randomLetter = randomLet();
        fontGeo = new THREE.TextBufferGeometry(randomLetter, {
          font: font,
          size: 7,
          height: 1,
          curveSegments: 12
        });
        fontMat = new THREE.MeshLambertMaterial({
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

        animate();
      });
    }

    function animate() {
      cloudParticles.forEach(p => {
        p.rotation.z -= 0.0005;
      });
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
      animateID(animate);
      renderer.render(scene, camera);
    }
  };

  render() {
    return (
      <div className="header header__container">
        <Navigation />
        <div className="header__three-canvas" ref={ref => (this.mount = ref)}></div>
        <header>
          <div className="header__text-box">
            <h1 className="header__heading-primary">Streamer Chat Games</h1>
            <h3 className="header__heading-sub">Pick your poison</h3>
          </div>
        </header>
        <div className="link-container">
          <div className="link-container__madlib">
            <NavLink className="link-container__btn" to="/Madlibs">
              Madlibs
            </NavLink>
            <div className="link-container__text">
              How <span className="dumb">dumb</span> clever is your chat?
            </div>
          </div>
          <div className="link-container__crosswords">
            <NavLink className="link-container__btn" to="/Madlibs">
              Crosswords
            </NavLink>
            <div className="link-container__text">How smart is your chat?</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
