// camera/ThirdPersonCamera.jsx
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function ThirdPersonCamera({ targetRef }) {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!targetRef.current) return;

    const targetPosition = targetRef.current.translation();

    const idealOffset = new THREE.Vector3(0, 3, 6);
    const newPosition = new THREE.Vector3(
      targetPosition.x + idealOffset.x,
      targetPosition.y + idealOffset.y,
      targetPosition.z + idealOffset.z
    );

    currentPosition.current.lerp(newPosition, 0.1);

    camera.position.copy(currentPosition.current);
    camera.lookAt(
      targetPosition.x,
      targetPosition.y + 1,
      targetPosition.z
    );
  });

  return null;
}
