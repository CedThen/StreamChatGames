import React from "react";
import "./Home.scss";
import * as THREE from "three";
import stormcloud from "../../imgs/stormcloud.png";
import { NavLink } from "react-router-dom";
const MontJson = require("../../Fonts/Montserrat_Regular.json");

class Home extends React.Component {
  componentDidMount() {
    let camera, scene, renderer;
    let cloudParticles = [],
      flash,
      ambient,
      directionalLight,
      rainCount = 500,
      rainDrop,
      rain = [];
    init();
    this.mount.appendChild(renderer.domElement);

    function init() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        2000
      );
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

      let fontL = new THREE.FontLoader();
      let font = fontL.parse(MontJson);

      function randomLetter() {
        return Math.floor(Math.random() * 36)
          .toString(36)
          .toUpperCase();
      }

      for (let r = 0; r < rainCount; r++) {
        let randomLet = randomLetter();
        let fontGeo = new THREE.TextBufferGeometry(randomLet, {
          font: font,
          size: 7,
          height: 1,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 1,
          bevelSize: 1,
          bevelOffset: 0,
          bevelSegments: 1
        });
        let fontMat = new THREE.MeshLambertMaterial({
          color: 0xa6d8d4,
          // map: texture,
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
        rainDrop.velocity = Math.random() * -5;
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
        p.velocity -= 0.01 + Math.random() * 0.01;
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
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    this.mount.appendChild(renderer.domElement);
  }

  render() {
    return (
      <div>
        <header className="header">
          <div className="header__three-canvas" ref={ref => (this.mount = ref)}></div>
          <div className="header__text-box">
            <h1 className="header__heading-primary">Streamer Chat Games</h1>
            <h3 className="header__heading-sub">Pick your poison</h3>
          </div>
        </header>
        <div className="body body__home">
          <div className="body__link-container">
            <div className="body__link-madlib">
              <NavLink className="body__nav-btn" to="/Madlibs">
                Madlibs
              </NavLink>
              <span className="body__text">
                How <span className="dumb">dumb</span> clever is your chat?
              </span>
            </div>
            <div>
              <NavLink className="body__nav-btn" to="/Madlibs">
                Crosswords
              </NavLink>
              <span className="body__text">How smart is your chat?</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
