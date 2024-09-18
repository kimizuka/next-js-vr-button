'use client';

import { useWindowSize } from '@uidotdev/usehooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  Sphere,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

const controllerModelFactory = new XRControllerModelFactory();

export function GameScene() {
  const { width, height } = useWindowSize();
  const [renderer, setRenderer] = useState<WebGLRenderer | null>(null);
  const [camera, setCamera] = useState<PerspectiveCamera | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [isHit, setIsHit] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHitRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    if (!renderer) {
      const newRenderer = new WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });

      newRenderer.setPixelRatio(window.devicePixelRatio);

      setRenderer(newRenderer);
    }

    if (!camera) {
      const newCamera = new PerspectiveCamera();

      setCamera(newCamera);
    }

    if (!scene) {
      const newScene = new Scene();

      setScene(newScene);
    }

    if (renderer && camera && scene) {
      init();
    }
  }, [renderer, camera, scene]);

  useEffect(() => {
    if (!width || !height) {
      return;
    }

    if (!renderer || !camera) {
      return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }, [width, height, renderer, camera]);

  const init = useCallback(() => {
    if (!renderer || !camera || !scene) {
      return;
    }

    renderer.xr.enabled = true;
    renderer.setClearColor(0xffffff, 1);

    const cube = new Mesh(
      new BoxGeometry(0.4, 0.4, 0.4),
      new MeshNormalMaterial(),
    );

    cube.position.set(0, 1.5, -1);
    cube.geometry.computeBoundingSphere();

    const cubeHit = new Sphere(
      cube.position,
      cube.geometry.boundingSphere?.radius || 0,
    );

    const sphere = new Mesh(
      new SphereGeometry(cube.geometry.boundingSphere?.radius, 8, 8),
      new MeshNormalMaterial(),
    );
    sphere.material.transparent = true;
    sphere.material.opacity = 0.4;

    scene.add(sphere);

    sphere.position.set(cube.position.x, cube.position.y, cube.position.z);

    scene.add(cube);

    const sphereA = new Mesh(
      new SphereGeometry(0.1, 8, 8),
      new MeshNormalMaterial(),
    );
    const sphereB = new Mesh(
      new SphereGeometry(0.1, 8, 8),
      new MeshNormalMaterial(),
    );
    const controllerA = renderer.xr.getController(0);
    const controllerB = renderer.xr.getController(1);
    const controllerModelA =
      controllerModelFactory.createControllerModel(controllerA);
    const controllerModelB =
      controllerModelFactory.createControllerModel(controllerB);

    sphereA.geometry.computeBoundingSphere();
    sphereB.geometry.computeBoundingSphere();

    const hitA = new Sphere(
      controllerA.position,
      sphereA.geometry.boundingSphere?.radius,
    );
    const hitB = new Sphere(
      controllerB.position,
      sphereB.geometry.boundingSphere?.radius,
    );

    sphereA.material.transparent = true;
    sphereA.material.opacity = 0.4;

    sphereB.material.transparent = true;
    sphereB.material.opacity = 0.4;

    controllerA.add(controllerModelA);
    controllerA.add(sphereA);

    controllerB.add(controllerModelB);
    controllerB.add(sphereB);

    scene.add(controllerA);
    scene.add(controllerB);

    camera.position.set(0, 1.7, 0);
    camera.lookAt(new Vector3(cube.position.x, cube.position.y, cube.position.z));

    scene.add(camera);

    window.addEventListener('click', async (evt: MouseEvent) => {
      const raycaster = new Raycaster();
      const vector = new Vector2(
        (evt.clientX / window.innerWidth) * 2 - 1,
        (evt.clientY / window.innerHeight) * -2 + 1,
      );

      raycaster.setFromCamera(vector, camera);

      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects[0]?.object === sphere) {
        hit();
      }
    });

    document.body.appendChild(VRButton.createButton(renderer));

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);

      hitA.center.set(
        controllerA.position.x,
        controllerA.position.y,
        controllerA.position.z,
      );
      hitB.center.set(
        controllerB.position.x,
        controllerB.position.y,
        controllerB.position.z,
      );
      cubeHit.center.set(cube.position.x, cube.position.y, cube.position.z);

      if (hitA.intersectsSphere(cubeHit) || hitB.intersectsSphere(cubeHit)) {
        isHitRef.current = true;
      } else {
        isHitRef.current = false;
      }

      if (isHitRef.current) {
        if (0.8 < cube.scale.x) {
          cube.scale.x -= 0.01;
          cube.scale.y -= 0.01;
          cube.scale.z -= 0.01;
        } else {
          cube.scale.x = 0.8;
          cube.scale.y = 0.8;
          cube.scale.z = 0.8;

          setIsHit(true);
        }
      } else {
        if (cube.scale.x < 1) {
          cube.scale.x += 0.01;
          cube.scale.y += 0.01;
          cube.scale.z += 0.01;
        } else {
          cube.scale.x = 1;
          cube.scale.y = 1;
          cube.scale.z = 1;

          setIsHit(false);
        }
      }
    });
  }, [renderer, camera, scene]);

  useEffect(() => {
    if (isHit) {
      hit();
    }
  }, [isHit]);

  function hit() {
    // Cubeに触れたときの処理を書く
    console.log('hit');
  }

  return <canvas ref={canvasRef} />;
}
