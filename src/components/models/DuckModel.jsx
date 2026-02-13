import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';

function DuckModel({position, rotation}) {
   const { scene } = useGLTF('/models/Duck.glb')

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
      }
    })
  }, [scene])
  return  <primitive
      object={scene}
      scale={1}
      position={position}
      rotation={rotation}
    />
}

export default DuckModel;

function HammerModel() {

  // const [state, setState] = useState({
  //   x: 0,
  //   y: 4,
  //   z: 0
  // });
  const { scene } = useGLTF('/models/DamagedHelmet.glb')

  const moveHammer = (direction) => {
    const { x, y, z } = state;
    switch (direction) {
      case 'left': setState({ x: x - 0.1, y, z }); break;
      case 'right': setState({ x: x + 0.1, y, z }); break;
      case 'forward': setState({ x, y, z: z - 0.1 }); break;
      case 'backward': setState({ x, y, z: z + 0.1 }); break;
      default: break;
    }
  };
  return <primitive
  object={scene}
  scale={0.8}
  position={[state.x, state.y, state.z]}
  rotation={[0, Math.PI, 0]}
/>
}

export { HammerModel };
