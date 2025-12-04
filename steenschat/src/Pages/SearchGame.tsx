{/*import './SearchGame.css'
{/*import type { CircleColor } from "../Components/Circle/Circle";*
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
};*

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

        {/* START OVERLAY *
        <SearchGameStart
          variant={variant}
          onStart={() => {
          }}
        />

      {/* SUCCES OVERLAY *
      {showSuccess && <Succes />}
    </div>
  )
}

export default SearchGame*/}

import { useEffect, useState } from 'react'
{/*import { useGameState } from '../Context/GameStateContext';*/}
import Succes from "../Components/Overlays/Succes/Succes";
{/*import SearchGameStart from '../Components/Overlays/SearchGameInstruction/SearchGameStart';*/}
import Circle from '../Components/Circle/Circle';
import MagnifyingGlass from '../Components/SearchGame/MagnifyingGlass';
import RockRegistration from '../Components/SearchGame/RockRegistration';
import './SearchGame.css'

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

const POSITIONS: Record<StoneType, { left: string; top: string }> = {
  amethist: { left: '30%', top: '55%' },
  rozenkwarts: { left: '65%', top: '28%' },
  citrien: { left: '12%', top: '72%' },
  aventurijn: { left: '72%', top: '62%' },
  obsidiaan: { left: '45%', top: '18%' },
};

const SearchGame: React.FC<SearchGameProps> = ({ variant = "rozenkwarts" }) => {
  {/*const { showStart, showSuccess } = useGameState();*/}

  const [found, setFound] = useState(window.location.hash === '#found');
  const [selectedStone] = useState<StoneType>(variant); // direct gelijk aan variant

  useEffect(() => {
    const onHash = () => {
      const isFound = window.location.hash === '#found';
      setFound(isFound);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="full-screen-container">
      <Circle size="base" text={selectedStone} index='high'/>

      {/*{showStart && (
        <SearchGameStart
          variant={variant}
          onStart={() => {}}
        />
      )}
        */}

      {found ? (
        <Succes />
      ) : (
        <>
          <MagnifyingGlass />
          <RockRegistration />

          <div className="background-content">
            <p className='content__text default-text text--reverse'>Beweeg het vergrootglas met de knoppen en vind de steen</p>
            <div className="pattern"></div>
          </div>

          <div className="container">
            {selectedStone && (() => {
              const pos = POSITIONS[selectedStone] || { left: '50%', top: '50%' };
              const style = { left: pos.left, top: pos.top } as React.CSSProperties;

              const imageSrc = stoneImages[selectedStone];
              if (imageSrc) {
                return (
                  <img
                    className={`rock ${selectedStone}`}
                    src={imageSrc}
                    alt={selectedStone}
                    style={style}
                  />
                );
              }

              return <div className={`rock stone-${selectedStone}`} style={style} />;
            })()}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchGame;