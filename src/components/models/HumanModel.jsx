import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function HumanCharacter({ rigidBodyRef  }) {
  const modelRef = useRef();  

  const pressedKeysRef = useKeyboardInput();
  const activeAnimationRef = useRef(null);

  const { scene, animations } = useGLTF("/models/optimized3.glb");
  const { actions } = useAnimations(animations, modelRef);

  const MOVEMENT = {
    walkSpeed: 2,
    runSpeed: 5,
    rotationSpeed: 3,
  };

  useFrame((state, delta) => {
    if (!modelRef.current || !actions) return;
    if (!rigidBodyRef?.current) return;

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

  useEffect(() => {
    //  shadow properties
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
      }
    });
  }, []);

  return (
    <RigidBody colliders={false} enabledRotations={[false, true, false]} ref={rigidBodyRef} >
      <primitive object={scene} position={[0, 0, -0.2]} ref={modelRef} scale={0.4} />
      <CapsuleCollider args={[0.3, 0.1]} />
    </RigidBody>
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

// function RotationController({
//   pressedKeysRef,
//   rigidBodyRef,
//   delta,
//   rotationSpeed,
// }) {
//   if (!rigidBodyRef?.current) return;
//   const body = rigidBodyRef.current;
//   // const currentEuler = new THREE.Euler(rotation.x, rotation.y, rotation.z);
//   let y = 0;
//   if (pressedKeysRef.current["arrowleft"]) {
//     y += Math.PI * rotationSpeed * delta;  // Rotate left
//   }

//   if (pressedKeysRef.current["arrowright"]) {
//     y -= Math.PI * rotationSpeed * delta;
//   }
//   body.setRotation(
//     {
//       x: 0,
//       y: y,
//       z: 0,
//       w: body.rotation().w
//     },
//     true
//   );
// }
function RotationController({
  pressedKeysRef,
  rigidBodyRef,
  delta,
  rotationSpeed,
}) {
  const body = rigidBodyRef?.current;
  if (!body) return;

  let rotationAmount = 0;

  if (pressedKeysRef.current["arrowleft"]) {
    rotationAmount += rotationSpeed * delta;
  }

  if (pressedKeysRef.current["arrowright"]) {
    rotationAmount -= rotationSpeed * delta;
  }

  if (rotationAmount === 0) return;

  const rotation = body.rotation();

  const currentQuat = new THREE.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

  const deltaQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 1, 0),
    rotationAmount
  );

  currentQuat.multiply(deltaQuat);

  body.setRotation(currentQuat, true);
}


/* =========================================================
   MOVEMENT CONTROLLER (Physics Based)
========================================================= */

// function MovementController({
//   motionState,
//   rigidBodyRef,
//   config,
// }) {
//   const body = rigidBodyRef?.current
//   if (!body) return;

//   const speed = motionState.isRunning
//     ? config.runSpeed
//     : config.walkSpeed;

//     // get forword direction
//   const rotation = body.rotation();


//   // convert it into quaternion
// const quaternion = new THREE.Quaternion(
//   rotation.x,
//   rotation.y,
//   rotation.z,
//   rotation.w
// );

// const direction = new THREE.Vector3(0, 0, -1);
// direction.applyQuaternion(quaternion);

// direction.y = 0;
// direction.normalize();
//   // if (motionState.isRunning || motionState.isForward) {
//   //   body.setLinvel(
//   //     direction.multiplyScalar(speed * 0.01)
//   //   );
//   // }
//   // else if (motionState.isBackward) {
//   //   body.setLinvel(
//   //     direction.multiplyScalar(-speed * 0.01)
//   //   );
//   // }
// }

function MovementController({
  motionState,
  rigidBodyRef,
  config,
}) {
  const body = rigidBodyRef?.current;
  if (!body) return;

  const speed = motionState.isRunning
    ? config.runSpeed
    : config.walkSpeed;

  // Get current rotation
  const rotation = body.rotation();

  // Convert to THREE quaternion
  const quaternion = new THREE.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );

  // Forward direction (-Z)
  const direction = new THREE.Vector3(0, 0, 1);
  direction.applyQuaternion(quaternion);
  direction.y = 0;
  direction.normalize();

  const currentVel = body.linvel();

  if (motionState.isForward || motionState.isRunning) {
    body.setLinvel(
      {
        x: direction.x * speed,
        y: currentVel.y,
        z: direction.z * speed,
      },
      true
    );
  } else if (motionState.isBackward) {
    body.setLinvel(
      {
        x: -direction.x * speed,
        y: currentVel.y,
        z: -direction.z * speed,
      },
      true
    );
  } else {
    // stop horizontal movement
    body.setLinvel(
      {
        x: 0,
        y: currentVel.y,
        z: 0,
      },
      true
    );
  }
}
