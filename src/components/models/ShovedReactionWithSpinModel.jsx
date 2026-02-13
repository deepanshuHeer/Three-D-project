import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function ShovedReactionWithSpinModel() {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/optimized.glb");
  const { actions } = useAnimations(animations, group);

  const [keys, setKeys] = useState({});
  const current = useRef("Idle");
  const speed = 2;

  // ✅ Play Idle first
  useEffect(() => {
    if (actions) {
      actions["Idle"]?.reset().fadeIn(0.2).play();
      current.current = "Idle";
    }
  }, [actions]);

useEffect(() => {
  // console.log("Animations array:", animations);
  console.log("Actions object:", actions);
}, [animations, actions]);
  // ✅ Keyboard listeners
  useEffect(() => {
    const down = (e) => setKeys((k) => ({ ...k, [e.key.toLowerCase()]: true }));
    const up = (e) => setKeys((k) => ({ ...k, [e.key.toLowerCase()]: false }));

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    if (!group.current || !actions) return;

    if (keys["w"]) {
      group.current.position.z -= speed * delta;

      if (current.current !== "Walk") {
        actions[current.current]?.fadeOut(0.2);
        actions["Walk"]?.reset().fadeIn(0.2).play();
        current.current = "Walk";
      }
    } else if (keys["shift"]) {
      group.current.position.z -= speed * 2 * delta;

      if (current.current !== "Run") {
        actions[current.current]?.fadeOut(0.2);
        actions["Run"]?.reset().fadeIn(0.2).play();
        current.current = "Run";
      }
    } else {
      if (current.current !== "Idle") {
        actions[current.current]?.fadeOut(0.2);
        actions["Idle"]?.reset().fadeIn(0.2).play();
        current.current = "Idle";
      }
    }
  });

  return (
    <primitive
      ref={group}
      object={scene}
      scale={1}
      position={[0, -1, 0]}
    />
  );
}

export default ShovedReactionWithSpinModel;
