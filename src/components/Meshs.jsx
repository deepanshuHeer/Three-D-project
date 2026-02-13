import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

function CubeMesh() {
  const cubeRef = useRef();
  useFrame((state, delta) => {
    cubeRef.current.rotation.x += 0.01;
  });
  return (
    <mesh ref={cubeRef} position={[-2, 0, 0]}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color="white" wireframe />
    </mesh>
  );
}

function SphereMesh() {
  const [isHover, setIsHover] = useState(false);
  const sphereRef = useRef();
  useFrame((state)=>{
    sphereRef.current.position.y = Math.sin(state.clock.elapsedTime);
  })
  return (
    <mesh 
      onPointerOver={()=> setIsHover(true)}
      onPointerOut={()=> setIsHover(false)}
    ref={sphereRef} position={[2, 0, 0]}>
      <sphereGeometry args={[0.7, 16, 16]} />
      <meshStandardMaterial color={isHover ? "yellow" : "blue"} wireframe />
    </mesh>
  );
}


function ConeMesh() {
  const conRef = useRef();
  useFrame((state,delta)=>{
     const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.2;
  conRef.current.scale.set(scale, scale, scale);
  })
  return (
    <mesh ref={conRef} position={[0, 0, 0]}>
      <coneGeometry args={[0.7, 1.5, 32]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}   

function RotatingBox() {
  const ref = useRef()

  useFrame(() => {
    ref.current.rotation.y += 0.01
    ref.current.rotation.x += 0.01
    ref.current.rotation.z += 0.01
  })

  return (
    <mesh ref={ref} position={[0,2,0]}>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

function SurfaceMesh() {
  return (
    <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="green" />
    </mesh>
  )
}

function WireframeBox() {
  return (
    <mesh position={[0, -2, 0]}>
      <boxGeometry args={[1,1,1]} />
      <meshBasicMaterial wireframe />
    </mesh>
  );
}




export { ConeMesh,Ground, CubeMesh, RotatingBox, SphereMesh, SurfaceMesh ,WireframeBox, Man};




function Man({ position }) {
  const ref = useRef();

  // Animate movement
  useFrame(() => {
    if (ref.current) {
      ref.current.position.x += 0; // No movement initially
      ref.current.position.y += 0; 
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.5, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.25, 0]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="peachpuff" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.5, 1.75, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        {/* <cylinderGeometry args={[1, 1, 2, 32]} /> */}
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh position={[0.5, 1.75, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  );
}
