import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FPSCamera = ({ targetRef }) => {

useFrame((state) => {
  if (!targetRef.current) return;

  const model = targetRef.current;

  // Offset behind model
  const offset = new THREE.Vector3(0, 1.5, -3);

  // Rotate offset based on model rotation
  offset.applyQuaternion(model.quaternion);

  const targetPosition = model.position.clone().add(offset);

  state.camera.position.lerp(targetPosition, 0.1);
  state.camera.lookAt(model.position);
});

  return null;
  //  <PointerLockControls /> 
}

export default FPSCamera