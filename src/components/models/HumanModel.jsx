import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HumanCharacter() {
  const characterRef = useRef();
  const pressedKeysRef = useKeyboardInput();
  const activeAnimationRef = useRef(null);

  const { scene, animations } = useGLTF("/models/optimized3.glb");
  const { actions } = useAnimations(animations, characterRef);

  const MOVEMENT = {
    walkSpeed: 2,
    runSpeed: 5,
    rotationSpeed: 2,
  };

  useFrame((state, delta) => {
    if (!characterRef.current || !actions) return;

    const motionState = MotionStateDetector(pressedKeysRef);

    AnimationController({
      motionState,
      actions,
      activeAnimationRef,
    });

    RotationController({
      pressedKeysRef,
      characterRef,
      delta,
      rotationSpeed: MOVEMENT.rotationSpeed,
    });

    MovementController({
      motionState,
      characterRef,
      delta,
      config: MOVEMENT,
    });

    // CameraFollowSystem({
    //   state,
    //   characterRef,
    // });
  });

  return (
   <RigidBody
  ref={characterRef}
  colliders={false}
  mass={1}
  lockRotations
  position={[0, 1, 0]}
>
  <CapsuleCollider args={[0.5, 0.4]} />
  <primitive object={scene} scale={0.5} />
</RigidBody>

  );
}

/* =========================================================
   KEYBOARD INPUT SYSTEM
========================================================= */

function useKeyboardInput() {
  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
}

/* =========================================================
   MOTION STATE DETECTOR
   (Decides what player is doing)
========================================================= */

function MotionStateDetector(keysRef) {
  const isForward = keysRef.current["w"];
  const isBackward = keysRef.current["s"];
  const isRunning = keysRef.current["shift"] && isForward;
  const isJumping = keysRef.current[" "];

  return {
    isForward,
    isBackward,
    isRunning,
    isJumping,
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
    if (!actions || activeAnimationRef.current === name) return;

    if (activeAnimationRef.current) {
      actions[activeAnimationRef.current]?.fadeOut(0.2);
    }

    actions[name]?.reset().fadeIn(0.2).play();
    activeAnimationRef.current = name;
  };

  if (motionState.isRunning) play("run");
  else if (motionState.isForward) play("walk");
  else if (motionState.isBackward) play("backwalk");
  else if (motionState.isJumping) play("jumping");
  else play("idle");
}

/* =========================================================
   ROTATION CONTROLLER
========================================================= */

function RotationController({
  pressedKeysRef,
  characterRef,
  delta,
  rotationSpeed,
}) {
  if (pressedKeysRef.current["a"]) {
    characterRef.current.rotation.y += rotationSpeed * delta;
  }

  if (pressedKeysRef.current["d"]) {
    characterRef.current.rotation.y -= rotationSpeed * delta;
  }
}

/* =========================================================
   MOVEMENT CONTROLLER
========================================================= */

function MovementController({
  motionState,
  characterRef,
  delta,
  config,
}) {
  if (!motionState.isForward && !motionState.isBackward) return;

  const speed = motionState.isRunning
    ? config.runSpeed
    : config.walkSpeed;

  const forward = new THREE.Vector3(0, 0, 1);
  forward.applyQuaternion(characterRef.current.quaternion);

  const direction = motionState.isBackward ? -1 : 1;

  characterRef.current.position.add(
    forward.multiplyScalar(speed * delta * direction)
  );
}

/* =========================================================
   CAMERA FOLLOW SYSTEM
========================================================= */

function CameraFollowSystem({ state, characterRef }) {
  const offset = new THREE.Vector3(0, 3, -6);
  offset.applyQuaternion(characterRef.current.quaternion);

  const targetPosition = characterRef.current.position
    .clone()
    .add(offset);

  state.camera.position.lerp(targetPosition, 0.1);
  state.camera.lookAt(characterRef.current.position);
}
