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

const POSITIONS: Record<StoneType, { left: string; top: string }> = {
  amethist: { left: '30%', top: '55%' },
  rozenkwarts: { left: '65%', top: '28%' },
  citrien: { left: '12%', top: '72%' },
  aventurijn: { left: '72%', top: '62%' },
  obsidiaan: { left: '45%', top: '18%' },
};

const SearchGame: React.FC<SearchGameProps> = ({ variant = "rozenkwarts" }) => {
  const {isPaused, showStart, showSuccess, hasStarted, setIsPaused, setShowStart, setShowSuccess, setHasStarted} = useGameState();

  const [found, setFound] = useState(window.location.hash === '#found');

  const stone = stoneByName[variant];
  const imageSrc = stone.img;
  const pos = POSITIONS[variant] || {
    left: "50%",
    top: "50%",
  };

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