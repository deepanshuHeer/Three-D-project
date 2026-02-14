import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HumanCharacter({ rigidBodyRef }) {
  const modelRef = useRef();   // Physics
       // Animations

  const pressedKeysRef = useKeyboardInput();
  const activeAnimationRef = useRef(null);

  const { scene, animations } = useGLTF("/models/optimized3.glb");
  const { actions } = useAnimations(animations, modelRef);

  const MOVEMENT = {
    walkSpeed: 2,
    runSpeed: 5,
    rotationSpeed: 2,
  };

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !actions) return;

    const motionState = MotionStateDetector(pressedKeysRef);

    AnimationController({
      motionState,
      actions,
      activeAnimationRef,
    });

    RotationController({
      pressedKeysRef,
      rigidBodyRef,   // ✅ rotate physics body
      delta,
      rotationSpeed: MOVEMENT.rotationSpeed,
    });

    MovementController({
      motionState,
      rigidBodyRef,   // ✅ move physics body
      config: MOVEMENT,
    });
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      mass={1}
      enabledRotations={[true, true, false]}
      position={[0.5, 3, 2]}
    >
      {/* <CapsuleCollider args={[0.5, 0.4]} /> */}
      <CapsuleCollider args={[0.5, 0.1]} />


      {/* Animations attach here */}
      <group ref={modelRef} position={[0, -0.1, -0.24]}>
        <primitive object={scene} scale={0.5} />
      </group>
    </RigidBody>
  );
}

/* =========================================================
   KEYBOARD INPUT SYSTEM
========================================================= */

function useKeyboardInput() {
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

function MotionStateDetector(keysRef) {
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

  const rotation = rigidBodyRef.current.rotation();
  const currentQuat = new THREE.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

  const euler = new THREE.Euler().setFromQuaternion(currentQuat);

  if (pressedKeysRef.current["arrowleft"]) {
    euler.y += rotationSpeed * delta;
  }

  if (pressedKeysRef.current["arrowright"]) {
    euler.y -= rotationSpeed * delta;
  }

  const newQuat = new THREE.Quaternion().setFromEuler(euler);

  rigidBodyRef.current.setRotation(newQuat, true);
}

/* =========================================================
   MOVEMENT CONTROLLER (Physics Based)
========================================================= */

function MovementController({
  motionState,
  rigidBodyRef,
  config,
}) {
  if (!rigidBodyRef.current) return;

  const speed = motionState.isRunning
    ? config.runSpeed
    : config.walkSpeed;

  const rotation = rigidBodyRef.current.rotation();
  const quaternion = new THREE.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

  const forward = new THREE.Vector3(0, 0, 1);
  forward.applyQuaternion(quaternion);

  let velocity = { x: 0, y: 0, z: 0 };
  // const currentVel = rigidBodyRef.current.linvel();

rigidBodyRef.current.setLinvel(velocity, true);

  if (motionState.isForward) {
    velocity.x = forward.x * speed;
    velocity.z = forward.z * speed;
  }

  if (motionState.isBackward) {
    velocity.x = -forward.x * speed;
    velocity.z = -forward.z * speed;
  }

  rigidBodyRef.current.setLinvel(velocity, true);
}
