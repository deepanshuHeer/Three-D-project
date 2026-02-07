import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/Duck.glb')
  return <primitive
  object={scene}
  scale={0.8}
  position={[0,1, 0]}
  rotation={[0, Math.PI, 0]}
/>
}

export default Model;

function HammerModel() {
  const { scene } = useGLTF('/models/DamagedHelmet.glb')
  return <primitive
  object={scene}
  scale={0.8}
  position={[0, 4, 0]}
  rotation={[0, Math.PI, 0]}
/>
}

export { HammerModel };