import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Ground from './environment/Ground';
import BgLight from './light/BgLight';
import FillLight from './light/FillLight';
import KeyLight from './light/KeyLight';

import { MapControls, Stats } from "@react-three/drei";
import { PointLight } from 'three';
import { MeshStandardNodeMaterial } from 'three/webgpu';
import { Physics } from '@react-three/rapier';

function Screen({ children }) {

  return (
    <div id="canvas-container" style={{ height: "100vh", width: "100vw", background: "red" }} >
      <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 75 }} >
        <Physics  debug>
        {children}
        </Physics>
      </Canvas>
    </div>
  )
}


export default Screen;
