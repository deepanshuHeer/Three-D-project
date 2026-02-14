// camera/CameraManager.jsx
import ThirdPersonCamera from "./ThirdPersonCamera";
import FPSCamera from "./FPSCamera";
import { OrbitControls } from "@react-three/drei";

export default function CameraManager({ mode, targetRef }) {
  return (
    <>
      {mode === "third" && <ThirdPersonCamera targetRef={targetRef} />}
      {mode === "fps" && <FPSCamera targetRef={targetRef} />}
      {mode === "orbit" && (
        <OrbitControls
          target={[0, 1, 0]}
          enablePan={false}
          minDistance={4}
          maxDistance={10}
        />
      )}
    </>
  );
}
