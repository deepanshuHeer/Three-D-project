import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { SurfaceMesh } from './Meshs';
import DuckModel from './models/DuckModel';
import KeyLight from './light/KeyLight';
import BgLight from './light/BgLight';
import FillLight from './light/FillLight';

function Screen() {

  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, -Math.PI / 2, 0]);

  const moveMan = (direction) => {
    setPosition(([x, y, z]) => {
      switch (direction) {
        case 'left':
          // setRotation([0, Math.PI / 2, 0])
          return [x - 0.1, y, z]

        case 'right':
          // setRotation([0, -Math.PI / 2, 0])
          return [x + 0.1, y, z]

        case 'forward':
          // setRotation([0, Math.PI, 0])
          return [x, y, z - 0.1]

        case 'backward':
          // setRotation([0, 0, 0])
          return [x, y, z + 0.1]

        default:
          return [x, y, z]
      }
    })
  }

  const rotationHandler = () => {
    setRotation(([x, y, z]) => [x, y + Math.PI / 2, z])
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key.toLowerCase()) {
        case 'a':
          moveMan('left')
          break
        case 'd':
          moveMan('right')
          break
        case 'w':
          moveMan('forward')
          break
        case 's':
          moveMan('backward')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  return (
    <div id="canvas-container" style={{ height: "100vh", width: "100vw", background: "red" }} >
      <Canvas shadows>
        <ambientLight intensity={0.6} />
        {/* Key light : Defines shape, direction, shadows */}
        <KeyLight />
        {/* Fill light : Without this → model looks too dark */}
        <FillLight />
        {/* back light : seperate duck from background */}
        <BgLight />
        <mesh position={[5, 8, 5]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
        <mesh position={[-5, 4, 3]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
        <mesh position={[0, 5, -5]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
        <group position={[0, 0, -4]} wireframe>


          <DuckModel position={position} rotation={rotation} />
          <SurfaceMesh />
        </group>
        {/* <OrbitControls target={[0, 0, 0]} enablePan={false}
          minDistance={3}
          maxDistance={15} /> */}
       <OrbitControls
  target={[0, 0, 0]}
  enablePan={false}
  minDistance={4}
  maxDistance={10}
  minPolarAngle={Math.PI / 6}
  maxPolarAngle={Math.PI / 2}
/>


      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <button onClick={() => moveMan('left')}>Left</button>
        <button onClick={() => moveMan('right')}>Right</button>
        <button onClick={() => moveMan('forward')}>Forward</button>
        <button onClick={() => moveMan('backward')}>Backward</button>
        <button onClick={rotationHandler}>Rotate</button>
      </div>

    </div>
  )
}


export default Screen;
