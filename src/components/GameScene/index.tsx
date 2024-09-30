'use client';

import { createStore } from '@/scripts/store';
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { useState } from 'react';

export function GameScene() {
  const [store] = useState(createStore());

  return (
    <>
      <button type="button" onClick={() => store?.enterAR()}>
        Enter AR
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
      </Canvas>
    </>
  );
}
