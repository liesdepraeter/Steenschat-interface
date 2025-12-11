import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react';
import { useInactivityTimeout } from './Hooks/useInactivityTimeout';
import { GameStateProvider, useGameState } from './Context/GameStateContext';
import { useInputController } from './Hooks/useInputController';
import SerialConnection from './Components/SerialConnection';

import './App.css'
import Home from './Pages/Home'
import Fact from './Pages/Fact'
import CatchGame from './Pages/CatchGame'
import SearchGame from './Pages/SearchGame'
import Allert from './Components/Overlays/Allert/Allert'
import SearchGameStart from './Components/Overlays/SearchGameInstruction/SearchGameStart';
import LoadingVideo from './Pages/LoadingVideo';



function App() {

  const AppContent = () => {
    const { showAlert, resetTimers } = useInactivityTimeout();
    const { setIsPaused, showStart, hasStarted, setShowStart, setHasStarted } = useGameState();
    const startOverlayWasVisibleRef = useRef(false);
    const wasPlayingRef = useRef(false);
    const alertWasActiveRef = useRef(false);

    // Blokkeer globale input zodra de alert zichtbaar is, hef op wanneer hij verdwijnt
    useEffect(() => {
      (window as any).__inputBlocked = showAlert;
      return () => {
        (window as any).__inputBlocked = false;
      };
    }, [showAlert]);

    useEffect(() => {
      if (showAlert) {
        if (!alertWasActiveRef.current) {
          // Eerste keer dat deze alert zichtbaar wordt: staat vastleggen
          startOverlayWasVisibleRef.current = showStart;
          wasPlayingRef.current = hasStarted && !showStart;
          alertWasActiveRef.current = true;
        }

        // Pauzeer en verberg start-overlay terwijl alert zichtbaar is
        setIsPaused(true);
        if (showStart) setShowStart(false);
      } else {
        if (alertWasActiveRef.current) {
          // Alert gesloten: herstel eerdere toestand
          if (startOverlayWasVisibleRef.current) {
            setShowStart(true);
            setHasStarted(false); // start-overlay forceert opnieuw starten
            setIsPaused(true);    // blijf gepauzeerd tot gebruiker start
          } else if (wasPlayingRef.current) {
            setHasStarted(true);
            setIsPaused(false);   // hervat spel
          } else {
            // Geen start-overlay en niet spelend (bijv. fact/home): gewoon unpause
            setIsPaused(false);
          }

          // Reset alert flag zodat volgende alert opnieuw kan vastleggen
          alertWasActiveRef.current = false;
        }
      }
    }, [showAlert, showStart, hasStarted, setHasStarted, setIsPaused, setShowStart]);

    /* RESET fallback */
    const navigate = useNavigate();
    useInputController({
      confirmOnAnyPress: true,
      onCommand: (cmd) => console.log(cmd),
      onReset: () => navigate('/'),
    });

    return (
      <>
      <Routes>
        <Route path='/' element={<Home/>}/>

        <Route path='/fact' element={<Fact stone='rozenkwarts'/>}/>
        <Route path='/rozenkwarts/fact' element={<Fact stone='rozenkwarts'/>}/>
        <Route path='/amethist/fact' element={<Fact stone='amethist'/>}/>
        <Route path='/citrien/fact' element={<Fact stone='citrien'/>}/>
        <Route path='/aventurijn/fact' element={<Fact stone='aventurijn'/>}/>
        <Route path='/obsidiaan/fact' element={<Fact stone='obsidiaan'/>}/>

        <Route path='/catchgame' element={<CatchGame variant='rozenkwarts'/>}/>
        <Route path='/rozenkwarts/catchgame' element={<CatchGame variant='rozenkwarts'/>}/>
        <Route path='/amethist/catchgame' element={<CatchGame variant='amethist'/>}/>
        <Route path='/citrien/catchgame' element={<CatchGame variant='citrien'/>}/>
        <Route path='/aventurijn/catchgame' element={<CatchGame variant='aventurijn'/>}/>
        <Route path='/obsidiaan/catchgame' element={<CatchGame variant='obsidiaan'/>}/>

        <Route path='/searchgame' element={<SearchGame variant='rozenkwarts'/>}/>
        <Route path='/rozenkwarts/searchgame' element={<SearchGame variant='rozenkwarts'/>}/>
        <Route path='/amethist/searchgame' element={<SearchGame variant='amethist'/>}/>
        <Route path='/citrien/searchgame' element={<SearchGame variant='citrien'/>}/>
        <Route path='/aventurijn/searchgame' element={<SearchGame variant='aventurijn'/>}/>
        <Route path='/obsidiaan/searchgame' element={<SearchGame variant='obsidiaan'/>}/>

        <Route path='/searchgamestart' element={<SearchGameStart variant='obsidiaan'/>}/>

        <Route path='/scanning' element={<LoadingVideo/>}/>
      </Routes>

      {showAlert && <Allert onPress={() => {
        resetTimers();
        // Effect boven pakt verdere herstel-logica wanneer showAlert weer false wordt
      }}
      />}
      </>
      );
  }

  return (
    <BrowserRouter>
      <GameStateProvider> 
        <SerialConnection/>
        <AppContent />
      </GameStateProvider>
    </BrowserRouter>

  )
}

export default App
