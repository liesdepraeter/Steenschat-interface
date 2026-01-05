import { useEffect, useState } from 'react'
import { useGameState } from '../Context/GameStateContext';
import { stoneByName, type StoneType } from '../data/stones';
import Succes from "../Components/Overlays/Succes/Succes";
import SearchGameStart from '../Components/Overlays/SearchGameInstruction/SearchGameStart';
import Circle from '../Components/Circle/Circle';
import MagnifyingGlass from '../Components/SearchGame/MagnifyingGlass';
import RockRegistration from '../Components/SearchGame/RockRegistration';
import './SearchGame.css'


interface SearchGameProps {
  variant?: StoneType;
}

// Oorspronkelijke vaste posities (niet meer gebruikt, vervangen door random):
// const POSITIONS: Record<StoneType, { left: string; top: string }> = {
//   amethist: { left: '30%', top: '55%' },
//   rozenkwarts: { left: '65%', top: '28%' },
//   citrien: { left: '12%', top: '72%' },
//   aventurijn: { left: '72%', top: '62%' },
//   obsidiaan: { left: '45%', top: '18%' },
// };

// Helper functie voor random positie met marges
const getRandomPosition = (): { left: string; top: string } => {
  // Marges van 15% aan alle kanten zodat stenen niet op de rand staan
  const minPercent = 15;
  const maxPercent = 85;
  
  const randomLeft = Math.random() * (maxPercent - minPercent) + minPercent;
  const randomTop = Math.random() * (maxPercent - minPercent) + minPercent;
  
  return {
    left: `${randomLeft}%`,
    top: `${randomTop}%`,
  };
};

const SearchGame: React.FC<SearchGameProps> = ({ variant = "rozenkwarts" }) => {
  const { showStart, showSuccess, hasStarted, setIsPaused, setShowStart, setHasStarted, setShowSuccess} = useGameState();

  const [found, setFound] = useState(false);
  // State voor random positie
  const [stonePos, setStonePos] = useState(() => getRandomPosition());

  const stone = stoneByName[variant];
  const imageSrc = stone.img;
  // Gebruik random positie in plaats van vaste POSITIONS
  const pos = stonePos;

  // Reset state on mount to prevent showing success immediately
  useEffect(() => {
    // Clear any existing hash
    if (window.location.hash === '#found') {
      window.location.hash = '';
    }
    // Reset found state
    setFound(false);
    // Reset showSuccess state
    setShowSuccess(false);
    // Reset game state
    setShowStart(true);
    setHasStarted(false);
    setIsPaused(true);
  }, [setShowStart, setHasStarted, setIsPaused, setShowSuccess]);

  useEffect(() => {
    const onHash = () => {
      const isFound = window.location.hash === '#found';
      setFound(isFound);
      if (isFound) {
        setShowSuccess(true);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [setShowSuccess]);

  // Update positie wanneer een nieuw spel start
  useEffect(() => {
    if (hasStarted) {
      setStonePos(getRandomPosition());
      // Clear hash when starting a new game
      if (window.location.hash === '#found') {
        window.location.hash = '';
        setFound(false);
      }
    }
  }, [hasStarted]);

  return (
    <div className="full-screen-container">
      <Circle size="base" text={variant} index='high'/>

      <div className="background-content">
        {/*<p className='content__text default-text text--reverse'>Beweeg het vergrootglas met de knoppen en vind de steen</p>*/}
        <div className="pattern"></div>
      </div>

        {showStart && !showSuccess && (
          <SearchGameStart
            variant={variant}
            onStart={() => {
              setShowStart(false);
              setHasStarted(true);
              setIsPaused(false);
            }}
          />
        )}

      {showSuccess || found ? (
        <Succes />
      ) : hasStarted ? (
        <>
          <MagnifyingGlass />
          <RockRegistration />

          

          <div className="container">
            {variant && (() => {
              const style = { left: pos.left, top: pos.top } as React.CSSProperties;

              if (imageSrc) {
                return (
                  <img
                    className={`rock ${variant}`}
                    src={imageSrc}
                    alt={variant}
                    style={style}
                  />
                );
              }

              return <div className={`rock stone-${variant}`} style={style} />;
            })()}
          </div>
        </>
      ): null}
    </div>
  );
};

export default SearchGame;