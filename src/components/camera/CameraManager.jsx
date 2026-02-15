// camera/CameraManager.jsx
import FPSCamera from "./FPSCamera";
import ThirdPersonCamera from "./ThirdPersonCamera";
import { OrbitControls } from "@react-three/drei";
import TopDownCamera from "./TopDownCamera";

export default function CameraManager({ mode, targetRef }) {
  return (
    <>
      {mode === "third" && <ThirdPersonCamera targetRef={targetRef} />}
      {mode === "fps" && <FPSCamera targetRef={targetRef} />}
      {mode === "topdown" && <TopDownCamera targetRef={targetRef} />}
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
