import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";

function Maze() {
    const mazeRef = useRef();
    const { scene, animations } = useGLTF("/models/updatedMaze.glb");

    return <>
        <RigidBody type="fixed" colliders="trimesh">
            <primitive ref={mazeRef} object={scene} />
        </RigidBody>
    </>
}

export default Maze
