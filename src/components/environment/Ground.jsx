import { RigidBody } from "@react-three/rapier";

function Ground() {
  return (
    <RigidBody type="fixed" colliders={'cuboid'}>

      <mesh rotation={[-Math.PI/2,0 ,0]} receiveShadow castShadow  position={[0,-0.5,0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#888888" roughness={1} />
      </mesh>
    </RigidBody>
  );
}

export default Ground;
