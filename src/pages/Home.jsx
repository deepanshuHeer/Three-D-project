import { useRef } from "react";
import Ground from "../components/environment/Ground";
import HumanCharacter from "../components/models/HumanModel";
import Screen from "../components/Screen";
import KeyLight from "../components/light/KeyLight";
import FillLight from "../components/light/FillLight";
import BgLight from "../components/light/BgLight";
import { CameraControls, FaceLandmarker, MapControls, OrbitControls, OrthographicCamera, PerspectiveCamera, PointerLockControls, Sphere, Stats, useHelper } from "@react-three/drei";
import { CameraHelper } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import FPSCamera from "../components/camera/FPSCamera";
import Maze from "../components/environment/Maze";
import CameraManager from "../components/camera/CameraManager";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
const Home = () => {

    const rigidBodyRef = useRef();
    const boxRef = useRef();

    return <>
        <Screen>
            <Stats />
            <MapControls />

            <KeyLight />
            <FillLight />
            <BgLight />
            
            <CameraManager mode={"fps"} targetRef={rigidBodyRef} />
            
            <RigidBody position={[0, 2, 0]} colliders='cuboid'>
                <mesh ref={boxRef} position={[-1, 0, 0]} wireframe receiveShadow castShadow>
                    <boxGeometry args={[0.5, 0.5, 0.5]} />
                    <meshStandardMaterial color="red" roughness={0.5} metalness={0.5} />
                </mesh>
            </RigidBody>

            {/* <Maze /> */}
                <HumanCharacter rigidBodyRef={rigidBodyRef} />
            <Ground />
        </Screen>
    </>
}

export default Home

const LightHelper = ({ cameraRef }) => {
    const { camera } = useThree()
    return (
        <>
            <PointerLockControls ref={camera} position={[0, 0, 10]} />
        </>
    )
}

export function ThirdPersonCamera({ targetRef, offset = [0, 3, 6] }) {
    useFrame(({ camera }) => {
        if (!targetRef.current) return;

        const targetPos = new THREE.Vector3();
        targetRef.current.getWorldPosition(targetPos);

        // Desired camera position behind the character
        const desiredPos = targetPos.clone().add(
            new THREE.Vector3(...offset)
        );

        // Smooth lerp for smooth following
        camera.position.lerp(desiredPos, 0.1);
        camera.lookAt(targetPos);
    });

    return null;
}