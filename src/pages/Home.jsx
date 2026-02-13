import HumanCharacter from "../components/models/HumanModel"
import Screen from "../components/Screen"
import Maze from "../components/environment/Maze"
const Home = () => {

    return <>
        <Screen>
            <HumanCharacter />
            <Maze/>
        </Screen>
    </>
}

export default Home