import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
import { useInactivityTimeout } from './Hooks/useInactivityTimeout';
import { GameStateProvider, useGameState } from './Context/GameStateContext';

import './App.css'
import Home from './Pages/Home'
import Fact from './Pages/Fact'
import CatchGame from './Pages/CatchGame'
import SearchGame from './Pages/SearchGame'
import Allert from './Components/Overlays/Allert/Allert'
import SearchGameStart from './Components/Overlays/SearchGameInstruction/SearchGameStart';
import { useInputController } from './Hooks/useInputController';


function App() {

  const AppContent = () => {
    const { showAlert, resetTimers } = useInactivityTimeout();
    const { setIsPaused, setShowStart, hasStarted } = useGameState();

    useEffect(() => {
      setIsPaused(showAlert);
    }, [showAlert, setIsPaused]);

    useEffect(() => {
      if (showAlert) {
        setShowStart(false);
      }
    }, [showAlert, setShowStart]);

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
      </Routes>

      {showAlert && <Allert onPress={() => {
        resetTimers(); 
        if (!hasStarted) {
          setShowStart(true);
        };
      }}
      />}
      </>
      );
  }

  return (
    <BrowserRouter>
      <GameStateProvider> 
        <AppContent />
      </GameStateProvider>
    </BrowserRouter>

  )
}

export default App
