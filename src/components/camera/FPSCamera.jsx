// // camera/FPSCamera.jsx
// import { useFrame, useThree } from "@react-three/fiber";

// export default function FPSCamera({ targetRef }) {
//   const { camera } = useThree();

//   useFrame(() => {
//     if (!targetRef.current) return;

//     const position = targetRef.current.translation();

//     camera.position.set(
//       position.x,
//       position.y + 1.6, // head height
//       position.z
//     );

//     // look forward direction
//     const forward = targetRef.current.rotation();
//     camera.rotation.set(0, forward.y, 0);
//   });

//   return null;
// }

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function FPSCamera({ targetRef }) {
  const { camera } = useThree();

  useFrame(() => {
    if (!targetRef.current) return;

    const position = targetRef.current.translation();
    const rotation = targetRef.current.rotation();

    // Set camera position (head height)
    camera.position.set(
      position.x,
      position.y + 1.6,
      position.z
    );

    // Convert quaternion → Euler
    const quat = new THREE.Quaternion(
      rotation.x,
      rotation.y,
      rotation.z,
      rotation.w
    );

    const euler = new THREE.Euler().setFromQuaternion(quat);

    camera.rotation.set(0, euler.y, 0);
  });

  return null;
}
