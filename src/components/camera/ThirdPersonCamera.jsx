import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ThirdPersonCamera = ({ targetRef }) => {
  useFrame((state, delta) => {
    if (!targetRef.current) return;

    const model = targetRef.current;

    // Offset (behind and above)
    const offset = new THREE.Vector3(0, 2, -5);

    // Rotate offset based on player rotation
    offset.applyQuaternion(model.quaternion);

    const desiredPosition = model.position.clone().add(offset);

    // Smooth follow
    state.camera.position.lerp(desiredPosition, 0.1);

    // Look slightly above player center
    const lookTarget = model.position.clone();
    lookTarget.y += 1.5;

    state.camera.lookAt(lookTarget);
  });

  return null;
};

export default ThirdPersonCamera;
