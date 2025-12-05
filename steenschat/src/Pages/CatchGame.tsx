import React, { useEffect, useRef, useState } from "react";
import { useGameState } from "../Context/GameStateContext";
import type { CircleColor } from "../Components/Circle/Circle";
import "./CatchGame.css";
import Circle from "../Components/Circle/Circle";
import CatchGameStart from "../Components/Overlays/CatchGameInstruction/CatchGameStart";
import Succes from "../Components/Overlays/Succes/Succes";

const variantColors: Record<StoneType, CircleColor> = {
  rozenkwarts: "red",
  citrien: "orange",
  aventurijn: "lemon",
  obsidiaan: "blue",
  amethist: "purple",
};

type StoneType = "rozenkwarts" | "citrien" | "aventurijn" | "obsidiaan" | "amethist";

interface CatchGameProps {
  variant?: StoneType;
}

const stoneImages: Record<StoneType, string> = {
  rozenkwarts: "/images/rozenkwarts.png",
  citrien: "/images/citrien.png",
  aventurijn: "/images/aventurijn.png",
  obsidiaan: "/images/obsidiaan.png",
  amethist: "/images/amethist.png",
};

const chestImage = "/images/treasure-chest-img.png";
const chestBottomImage = "/images/treasure-chest-img--bottom.png";

interface FallingStone {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: StoneType;
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

  // sizes
  const basketWidth = 130;
  const basketHeight = 50;
  const stoneWidth = 50;

  // state
  const [basketX, setBasketX] = useState(0);
  const basketXRef = useRef(0);
  const [score, setScore] = useState(0);
  const [stones, setStones] = useState<FallingStone[]>([]);

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
      const types: StoneType[] = ["rozenkwarts", "citrien", "aventurijn", "obsidiaan", "amethist"];

      const newStone: FallingStone = {
        id: Date.now(),
        x: Math.random() * (containerWidth - stoneWidth),
        y: 0,
        speed: 2 + Math.random() * 2,
        type: types[Math.floor(Math.random() * types.length)],
      };

      setStones(prev => [...prev, newStone]);
    }, 900);

    return () => clearInterval(interval);
  }, [isPaused, hasStarted, showSuccess]);

  // --- GAME LOOP ---
  const gameLoop = () => {
    if (isPaused || !hasStarted || showSuccess || !containerRef.current) return;

    const containerHeight = containerRef.current.clientHeight;

    setStones(prev =>
      prev
        .map(s => ({ ...s, y: s.y + s.speed }))
        .filter(stone => {
          const bottom = containerHeight - basketHeight;

          if (stone.y + stoneWidth >= bottom) {
            const caught =
              stone.x + stoneWidth > basketXRef.current &&
              stone.x < basketXRef.current + basketWidth;

            if (caught) {
              setScore(sc => {
                const newScore = stone.type === variant ? sc + 1 : Math.max(0, sc - 1);

                if (newScore >= 10) {
                  setIsPaused(true);
                  setShowSuccess(true);
                }

                return newScore;
              });
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

  return (
    <div className="full-screen-container" ref={containerRef}>

      {/* SCORE */}
      <div className="score-box">
        <Circle size="base" color={variantColors[variant]}>
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
      {/*<img src={chestImage} className="basket" style={{ left: basketX }} />*/}

      {/* STONES */}
      {stones.map(s => (
        <img
          key={s.id}
          src={stoneImages[s.type]}
          className="stone"
          style={{ left: s.x, top: s.y }}
        />
      ))}
    </div>
  );
};

export default CatchGame;




{/*import React, { useEffect, useRef, useState } from "react";
import "./CatchGame.css";
import Circle from "../Components/Circle/Circle";

type StoneType = "rozenkwarts" | "citrien" | "aventurijn" | "obsidiaan" | "amethist";

interface CatchGameProps {
  variant?: StoneType;
}

const stoneImages: Record<StoneType, string> = {
  rozenkwarts: "/images/rozenkwarts.png",
  citrien: "/images/citrien.png",
  aventurijn: "/images/aventurijn.png",
  obsidiaan: "/images/obsidiaan.png",
  amethist: "/images/amethist.png",
};

const chestImage = "/images/mand.png";


const CatchGame: React.FC<CatchGameProps> = ({ variant = "rozenkwarts" }) => {

}
export default CatchGame;*/}