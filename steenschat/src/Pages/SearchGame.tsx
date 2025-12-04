import './SearchGame.css'
{/*import type { CircleColor } from "../Components/Circle/Circle";*/}
import { useGameState } from '../Context/GameStateContext';
import Succes from "../Components/Overlays/Succes/Succes";
import SearchGameStart from '../Components/Overlays/SearchGameInstruction/SearchGameStart';
import Circle from '../Components/Circle/Circle';


{/*const variantColors: Record<StoneType, CircleColor> = {
  rozenkwarts: "red",
  citrien: "orange",
  aventurijn: "lemon",
  obsidiaan: "blue",
  amethist: "purple",
};*/}

type StoneType = "rozenkwarts" | "citrien" | "aventurijn" | "obsidiaan" | "amethist";

interface SearchGameProps {
  variant?: StoneType;
}

const stoneImages: Record<StoneType, string> = {
  rozenkwarts: "/images/rozenkwarts.png",
  citrien: "/images/citrien.png",
  aventurijn: "/images/aventurijn.png",
  obsidiaan: "/images/obsidiaan.png",
  amethist: "/images/amethist.png",
};


const SearchGame: React.FC<SearchGameProps> = ({ variant = "rozenkwarts" }) => {

    const {
        isPaused,
        showStart,
        showSuccess,
        hasStarted,
        setIsPaused,
        setShowStart,
        setShowSuccess,
        setHasStarted
    } = useGameState();

  return (
    <div className="full-screen-container">
        <Circle size='base' text={variant}/>

        {/* START OVERLAY */}
        <SearchGameStart
          variant={variant}
          onStart={() => {
          }}
        />

      {/* SUCCES OVERLAY */}
      {showSuccess && <Succes />}
    </div>
  )
}

export default SearchGame