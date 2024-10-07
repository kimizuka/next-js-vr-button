'use client';

import { createStore } from '@/scripts/store';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { useState } from 'react';
import styles from './index.module.scss';

export function GameScene() {
  const [store] = useState(createStore());

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
            <mesh
              pointerEventsType={{ deny: 'grab' }}
              onClick={() => console.log('click')}
              position={[0, 1.5, -1]}
              scale={[0.4, 0.4, 0.4]}
            >
              <boxGeometry />
              <meshNormalMaterial />
            </mesh>
          </XR>
        )}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
