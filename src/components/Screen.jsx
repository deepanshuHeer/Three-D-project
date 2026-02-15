import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Ground from './environment/Ground';
import BgLight from './light/BgLight';
import FillLight from './light/FillLight';
import KeyLight from './light/KeyLight';

import { MapControls, Stats } from "@react-three/drei";
import { PointLight } from 'three';
import { MeshStandardNodeMaterial } from 'three/webgpu';

function Screen({ children, rigidBodyRef }) {

  return (
    <div id="canvas-container" style={{ height: "100vh", width: "100vw", background: "red" }} >
      <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 75 }} >
        {children}
      </Canvas>
    </div>
  )
}


export default Screen;
