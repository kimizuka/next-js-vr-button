'use client';

import { createStore } from '@/scripts/store';
import { OrbitControls, Text3D } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { useEffect, useState } from 'react';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import styles from './index.module.scss';

export function ClockScene() {
  const [store] = useState(createStore());

  function Plane() {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

    return (
      <mesh ref={ref as any}>
        <planeGeometry args={[100, 100]} />
      </mesh>
    )
  }

  function Text({
    label = '',
    position = [0, 0, 0],
  }) {
    const [scaleX] = useState(label.length * 1.4);
    const [ref] = useBox(() => ({ mass: 1, position: position as any }))

    return (
      <mesh
        ref={ref as any}
        scale={[scaleX, 1, 1]}
      >
        <Text3D
          font="/m-plus-1-code-bold.json"
          position={[-.7 / scaleX * label.length, 0, 0]}
          scale={[1 / scaleX, 1, 1]}
          height={1}
          bevelThickness={0.1}
        >
          <meshNormalMaterial />
          {label}
        </Text3D>
      </mesh>
    )
  }

  function Clock() {
    const [hour, setHour] = useState(0);
    const [hourRadian, setHourRadian] = useState(0);
    const [minute, setMinute] = useState(0);
    const [minuteRadian, setMinuteRadian] = useState(0);

    useEffect(() => {
      setHourRadian(-hour * Math.PI / 6);
    }, [hour]);

    useEffect(() => {
      setMinuteRadian(-minute * Math.PI / 30);
    }, [minute]);

    useFrame(() => {
      const date = new Date();
      const hours = date.getHours() % 12;
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      setHour(hours + minutes / 60 + seconds / 3600);
      setMinute(minutes + seconds / 60);
    });

    return (
      <group
        rotation={[Math.PI / 2, 0, 0]}
        scale={[.5, .5, .5]}
      >
        <mesh scale={[1, .1, 1]}>
          <cylinderGeometry />
        </mesh>
        <group
          position={[0, .07, 0]}
          rotation={[0, hourRadian, 0]}
        >
          <mesh
            position={[0, 0, -.25]}
            scale={[.1,.01,.5]}
          >
            <boxGeometry />
            <meshBasicMaterial color="red" />
          </mesh>
        </group>
        <group
          position={[0, .06, 0]}
          rotation={[0, minuteRadian, 0]}
        >
          <mesh
            position={[0, 0, -.4]}
            scale={[.1, .01, .8]}
          >
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
        </group>
      </group>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        type="button"
        onClick={() => store?.enterAR()}
      >
        Enter VR
      </button>
      <Canvas>
        {store && (
          <XR store={store}>
            <Clock />
            <Physics>
              {/* <Plane /> */}
            </Physics>
          </XR>
        )}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
