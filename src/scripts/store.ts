import { createXRStore } from '@react-three/xr';

export function createStore() {
  if (typeof window === 'undefined') {
    return null;
  }

  return createXRStore();
}
