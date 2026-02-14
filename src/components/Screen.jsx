import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Ground from './environment/Ground';
import BgLight from './light/BgLight';
import FillLight from './light/FillLight';
import KeyLight from './light/KeyLight';
import { Physics } from '@react-three/rapier';
import { useEffect, useState } from 'react';
import CameraManager from './camera/CameraManager';

function Screen({children, rigidBodyRef}) {

  const [cameraMode, setCameraMode] = useState("third");
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "c") {
        setCameraMode((prev) =>
          prev === "third"
            ? "fps"
            : prev === "fps"
            ? "orbit"
            : "third"
        );
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);


  return (
    <div id="canvas-container" style={{ height: "80vh", width: "100vw", background: "red" }} >
      <Canvas shadows>
    <Physics debug>

   
        <ambientLight intensity={0.6} />
        {/* Key light : Defines shape, direction, shadows */}
        <KeyLight />
        {/* Fill light : Without this → model looks too dark */}
        <FillLight />
        {/* back light : seperate duck from background */}
        <BgLight />
      {children}
        <Ground />

 <CameraManager mode={cameraMode} targetRef={rigidBodyRef} />

        
 </Physics>
      </Canvas>
    </div>
  )
}


export default Screen;
