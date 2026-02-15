import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const FPSCamera = ({ targetRef }) => {
useFrame((state) => {
  const body = targetRef.current;
  if (!body) return;

  const position = body.translation();
  const rotation = body.rotation();

  const bodyPosition = new THREE.Vector3(
    position.x,
    position.y,
    position.z
  );

  const quaternion = new THREE.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

  const offset = new THREE.Vector3(0, 0.5, -1);
  offset.applyQuaternion(quaternion);

  const targetPosition = bodyPosition.clone().add(offset);

  state.camera.position.lerp(targetPosition, 0.1);
  state.camera.lookAt(bodyPosition);
});

  return null;
}

export default FPSCamera