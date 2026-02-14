import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";

function Maze() {
    const { scene } = useGLTF("/models/updatedMaze.glb");

    return <>
        <RigidBody type="fixed" colliders="trimesh" >
            <primitive  object={scene}  />
        </RigidBody>
    </>
}

export default Maze
