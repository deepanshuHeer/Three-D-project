import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Ground from './environment/Ground';
import BgLight from './light/BgLight';
import FillLight from './light/FillLight';
import KeyLight from './light/KeyLight';
import { Physics } from '@react-three/rapier';

function Screen({children}) {

  return (
    <div id="canvas-container" style={{ height: "80vh", width: "100vw", background: "red" }} >
      <Canvas shadows>
    <Physics>

   
        <ambientLight intensity={0.6} />
        {/* Key light : Defines shape, direction, shadows */}
        <KeyLight />
        {/* Fill light : Without this → model looks too dark */}
        <FillLight />
        {/* back light : seperate duck from background */}
        <BgLight />
      {children}
        <Ground />
        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          minPolarAngle={Math.PI / 6}
        />
 </Physics>
      </Canvas>
      
    </div>
  )
}


export default Screen;
