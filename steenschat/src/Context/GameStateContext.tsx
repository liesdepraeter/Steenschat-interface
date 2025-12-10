import React, { createContext, useContext, useState } from 'react';

interface GameStateContextType {
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;

  showStart: boolean;
  setShowStart: (value: boolean) => void;

  showSuccess: boolean;
  setShowSuccess: (value: boolean) => void;

  hasStarted: boolean;
  setHasStarted: (value: boolean) => void;

}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const GameStateProvider = ({children}: { children:React.ReactNode }) => {
  const [isPaused, setIsPaused] = useState(false); 
  const [showStart, setShowStart] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const value: GameStateContextType = {
    isPaused,
    setIsPaused,
    showStart,
    setShowStart,
    showSuccess,
    setShowSuccess,
    hasStarted,
    setHasStarted,
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};