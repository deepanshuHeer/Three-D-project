import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TopDownCamera = ({ targetRef }) => {
  useFrame((state) => {
    if (!targetRef.current) return;

    const model = targetRef.current;

    const height = 15;

    const desiredPosition = new THREE.Vector3(
      model.position.x,
      height,
      model.position.z
    );

    state.camera.position.lerp(desiredPosition, 0.1);

    state.camera.lookAt(model.position);
  });

  return null;
};

export default TopDownCamera;
