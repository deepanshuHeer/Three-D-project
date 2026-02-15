
function Ground() {
  return (
      <mesh rotation={[-Math.PI/2,0 ,0]} receiveShadow  position={[0,-0.5,0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#888888" roughness={1} />
      </mesh>
  );
}

export default Ground;
