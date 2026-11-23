'use client';

import { createStore } from '@/scripts/store';
import { OrbitControls, Text3D } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { useEffect, useRef, useState } from 'react';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import styles from './index.module.scss';

export function GameScene() {
  const [store] = useState(createStore());

  function Plane() {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));

    return (
      <mesh ref={ref as any}>
        {/* <planeGeometry args={[100, 100]} /> */}
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
    return (
      <mesh></mesh>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.button}
        type="button"
        onClick={() => store?.enterVR()}
      >
        Enter VR
      </button>
      <Canvas>
        {store && (
          <XR store={store}>
            <Physics>
              <mesh
                pointerEventsType={{ deny: 'grab' }}
                onClick={() => console.log('click')}
                position={[0, 3, -1]}
                scale={[0.4, 0.4, 0.4]}
              >
                <boxGeometry />
                <meshNormalMaterial />
              </mesh>
              <Text
                position={[0, 1.5, -1]}
                label="ミーティング"
              />
              <Plane />
            </Physics>
          </XR>
        )}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
