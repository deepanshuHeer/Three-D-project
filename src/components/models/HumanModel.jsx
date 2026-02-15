import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HumanCharacter({modelRef}) {
  // const modelRef = useRef();   // Physics

  const pressedKeysRef = useKeyboardInput();
  const activeAnimationRef = useRef(null);

  const { scene, animations } = useGLTF("/models/optimized3.glb");
  const { actions } = useAnimations(animations, modelRef);

  const MOVEMENT = {
    walkSpeed: 2,
    runSpeed: 5,
    rotationSpeed: 0.5,
  };

  useFrame((state, delta) => {
    if (!modelRef.current || !actions) return;

    const motionState = MotionStateDetector(pressedKeysRef);

    AnimationController({
      motionState,
      actions,
      activeAnimationRef,
    });

    RotationController({
      pressedKeysRef,
      rigidBodyRef: modelRef,   // ✅ rotate physics body
      delta,
      rotationSpeed: MOVEMENT.rotationSpeed,
    });

    MovementController({
      motionState,
      rigidBodyRef: modelRef,   // ✅ move physics body
      config: MOVEMENT,
    });
  });

  useEffect(() => {
  //  shadow properties
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
    }
  });
  }, []);

  return (
    <group ref={modelRef} >
      <primitive object={scene} position={[0,0,-0.2]} scale={0.5} />
    </group>
  );
}

/* =========================================================
   KEYBOARD INPUT SYSTEM
========================================================= */

export function useKeyboardInput() {
  const keys = useRef({});

  useEffect(() => {
    const down = (e) => (keys.current[e.key.toLowerCase()] = true);
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return keys;
}

/* =========================================================
   MOTION STATE DETECTOR
========================================================= */

export function MotionStateDetector(keysRef) {
  return {
    isForward: keysRef.current["arrowup"],
    isBackward: keysRef.current["arrowdown"],
    isRunning: keysRef.current["shift"] && keysRef.current["arrowup"],
    isJumping: keysRef.current[" "],
  };
}

/* =========================================================
   ANIMATION CONTROLLER
========================================================= */

function AnimationController({
  motionState,
  actions,
  activeAnimationRef,
}) {
  const play = (name) => {
    if (!actions[name] || activeAnimationRef.current === name) return;

    if (activeAnimationRef.current) {
      actions[activeAnimationRef.current]?.fadeOut(0.2);
    }

    actions[name].reset().fadeIn(0.2).play();
    activeAnimationRef.current = name;
  };

  if (motionState.isRunning) play("run");
  else if (motionState.isForward) play("walk");
  else if (motionState.isBackward) play("backwalk");
  else if (motionState.isJumping) play("jumping");
  else play("idle");
}

/* =========================================================
   ROTATION CONTROLLER (Physics Based)
========================================================= */

function RotationController({
  pressedKeysRef,
  rigidBodyRef,
  delta,
  rotationSpeed,
}) {
  if (!rigidBodyRef.current) return;

  const rotation = rigidBodyRef.current.rotation;
  // const currentEuler = new THREE.Euler(rotation.x, rotation.y, rotation.z);

  if (pressedKeysRef.current["arrowleft"]) {
    rotation.y += Math.PI * rotationSpeed * delta;  // Rotate left
  }

  if (pressedKeysRef.current["arrowright"]) {
    rotation.y -= Math.PI * rotationSpeed * delta;
  }

  // rigidBodyRef.current.rotation.set(
  //   currentEuler.x,
  //   currentEuler.y,
  //   currentEuler.z
  // );
}

/* =========================================================
   MOVEMENT CONTROLLER (Physics Based)
========================================================= */

// function MovementController({
//   motionState,
//   rigidBodyRef,
//   config,
// }) {
//   if (!rigidBodyRef.current) return;

//   const speed = motionState.isRunning
//     ? config.runSpeed
//     : config.walkSpeed;
//   const direction = new THREE.Vector3();
//   rigidBodyRef.current.getWorldDirection(direction);

//   if (motionState.isRunning || motionState.isForward) {

//     rigidBodyRef.current.position.add(
//       direction.multiplyScalar(speed * 0.01)
//     );
//   }
//   else if (motionState.isBackward) {
//     rigidBodyRef.current.position.add(
//       direction.multiplyScalar(-speed * 0.01)
//     );
//   }
// }


function MovementController({
  motionState,
  rigidBodyRef,
  config,
}) {
  useFrame((_, delta) => {
    if (!rigidBodyRef.current) return;

    const model = rigidBodyRef.current;

    const speed = motionState.isRunning
      ? config.runSpeed
      : config.walkSpeed;

    const direction = new THREE.Vector3();
    model.getWorldDirection(direction);

    // Prevent vertical movement
    direction.y = 0;
    direction.normalize();

    if (motionState.isRunning || motionState.isForward) {
      model.position.add(
        direction.clone().multiplyScalar(speed * delta)
      );
    } else if (motionState.isBackward) {
      model.position.add(
        direction.clone().multiplyScalar(-speed * delta)
      );
    }

    // 🧱 Boundary (Clamp Method)
    model.position.x = THREE.MathUtils.clamp(
      model.position.x,
      -10,
      10
    );

    model.position.z = THREE.MathUtils.clamp(
      model.position.z,
      -10,
      10
    );
  });

  return null;
}