import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { ConeMesh, CubeMesh, SphereMesh, SurfaceMesh, WireframeBox } from './Meshs';
import Model, { HammerModel } from './models/DuckModel';

function Screen() {

  const [position, setPosition] = useState([0, 0, 0]);

  const moveMan = (direction) => {
    const [x, y, z] = position;
    switch (direction) {
      case 'left': setPosition([x - 0.1, y, z]); break;
      case 'right': setPosition([x + 0.1, y, z]); break;
      case 'forward': setPosition([x, y, z - 0.1]); break;
      case 'backward': setPosition([x, y, z + 0.1]); break;
      default: break;
    }
  };
  return (
    <div id="canvas-container" style={{ height: "100vh", width: "100vw", background: "green" }} >
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        <group position={[0, 0, 4]}>
          <CubeMesh />
          <SphereMesh />
          <ConeMesh />
          {/* <RotatingBox/> */}
          <SurfaceMesh />
          <WireframeBox />
        <Model />
        <HammerModel/>
        </group>
        <OrbitControls target={[0, 0, 0]} enablePan={false}
          minDistance={3}
          maxDistance={15} />
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button onClick={() => moveMan('left')}>Left</button>
        <button onClick={() => moveMan('right')}>Right</button>
        <button onClick={() => moveMan('forward')}>Forward</button>
        <button onClick={() => moveMan('backward')}>Backward</button>
      </div>

    </div>
  )
}


export default Screen;
