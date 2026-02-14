import HumanCharacter from "../components/models/HumanModel"
import Screen from "../components/Screen"
import Maze from "../components/environment/Maze"
import { useRef } from "react";
const Home = () => {

    const rigidBodyRef = useRef();  
    return <>
        <Screen rigidBodyRef={rigidBodyRef}> 
            <HumanCharacter rigidBodyRef={rigidBodyRef} />
            <Maze/>
        </Screen>
    </>
}

export default Home