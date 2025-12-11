import React, { useEffect, useRef, useState } from "react";
import { useGameState } from "../Context/GameStateContext";
import { stoneByName, allStoneTypes, type StoneType } from "../data/stones";
import "./CatchGame.css";
import Circle from "../Components/Circle/Circle";
import CatchGameStart from "../Components/Overlays/CatchGameInstruction/CatchGameStart";
import Succes from "../Components/Overlays/Succes/Succes";


const chestImage = "/images/treasure-chest-img.png";
const chestBottomImage = "/images/treasure-chest-img--bottom.png";



interface CatchGameProps {
  variant?: StoneType;
}

interface FallingStone {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: StoneType;
  caught?: boolean;
}

const CatchGame: React.FC<CatchGameProps> = ({ variant = "rozenkwarts" }) => {

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

  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const caughtStonesRef = useRef<Set<number>>(new Set());

  // sizes
  const basketWidth = 130;
  const basketHeight = 50;
  const stoneWidth = 50;

  // state
  const [basketX, setBasketX] = useState(0);
  const basketXRef = useRef(0);
  const [score, setScore] = useState(0);
  const [stones, setStones] = useState<FallingStone[]>([]);

  // Reset state on mount so de start-overlay altijd beschikbaar is bij binnenkomen
  useEffect(() => {
    setShowStart(true);
    setHasStarted(false);
    setShowSuccess(false);
    setIsPaused(true);
    caughtStonesRef.current.clear();
    setScore(0);
    setStones([]);
  }, [setShowStart, setHasStarted, setShowSuccess, setIsPaused]);

  // ---SOUNDS ---
  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    wrongSoundRef.current = new Audio("/sounds/wrong.wav");
  }, []);

  // --- KEYBOARD ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isPaused || showStart || showSuccess || !containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;

      setBasketX(prev => {
        let newX = prev;
        if (e.key === "ArrowLeft") newX = Math.max(0, prev - 30);
        if (e.key === "ArrowRight") newX = Math.min(containerWidth - basketWidth, prev + 30);
        basketXRef.current = newX;
        return newX;
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPaused, showStart, showSuccess]);

  // --- STONE GENERATOR ---
  useEffect(() => {
    if (isPaused || !hasStarted || showSuccess) return;

    const interval = setInterval(() => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const randomType = allStoneTypes[Math.floor(Math.random() * allStoneTypes.length)];

      const newStone: FallingStone = {
        id: Date.now(),
        x: Math.random() * (containerWidth - stoneWidth),
        y: 0,
        speed: 2 + Math.random() * 2,
        type: randomType, 
      }; 

      setStones(prev => [...prev, newStone]);
    }, 900);

    return () => clearInterval(interval);
  }, [isPaused, hasStarted, showSuccess]);

  // --- GAME LOOP ---
  const gameLoop = () => {
    if (isPaused || !hasStarted || showSuccess || !containerRef.current) {
      return;
    }

    const containerHeight = containerRef.current.clientHeight;
    const bottom = containerHeight - basketHeight;

    setStones(prev =>
      prev
        .map(s => ({ ...s, y: s.y + s.speed }))
        .filter(stone => {
          if (stone.y + stoneWidth >= bottom) {
            const caught =
              stone.x + stoneWidth > basketXRef.current &&
              stone.x < basketXRef.current + basketWidth;

            if (caught && !caughtStonesRef.current.has(stone.id)) {
              caughtStonesRef.current.add(stone.id);
              
              if (stone.type === variant) {
                correctSoundRef.current?.play();
                setScore(sc => {
                  const newScore = sc + 1;
                  if (newScore >= 5) {
                    setIsPaused(true);
                    setShowSuccess(true);
                  }
                  return newScore;
                });
              } else {
                wrongSoundRef.current?.play();
                setScore(sc => Math.max(0, sc - 1));
              }
            }
            return false;
          }
          return true;
        })
    );

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (!isPaused && hasStarted && !showSuccess) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused, hasStarted, showSuccess]);

  const stoneColor = stoneByName[variant].color;

  return (
    <div className="full-screen-container" ref={containerRef}>

      {/* SCORE */}
      <div className="score-box">
        <Circle size="base" color={stoneColor}> {/*variantColors[variant]*/}
          <p>Score: {score}</p>
        </Circle>
      </div>

      {/* START OVERLAY */}
      {showStart && !showSuccess && (
        <CatchGameStart
          variant={variant}
          onStart={() => {
            setShowStart(false);
            setHasStarted(true);
            setIsPaused(false);
            console.log('instructie verdwijnt (setShowStart=false), spel start (setHasStarted=true)');
          }}
        />
      )}

      {/* SUCCES OVERLAY */}
      {showSuccess && <Succes />}

      {/* BASKET */}
      <div className="basket-container" style={{ left: basketX }}>
        <img src={chestImage} className="basket" />
        <img src={chestBottomImage} className="basket-bottom" />
      </div>

      {/* STONES */}
      {stones.map(s => (
        <img
          key={s.id}
          src={stoneByName[s.type].img}
          className="stone"
          style={{ left: s.x, top: s.y }}
        />
      ))}
    </div> 
  );
};

export default CatchGame;