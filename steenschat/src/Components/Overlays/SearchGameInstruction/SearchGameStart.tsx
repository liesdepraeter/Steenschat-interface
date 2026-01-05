import {type StoneType} from '../../../data/stones';
import './SearchGameStart.css'
import IconArrow from '../../Icons/IconArrow';
import { useInputController } from '../../../Hooks/useInputController';
import { useRef } from 'react';

interface SearchGameProps {
  variant?: StoneType;
  onStart?: () => void;
}

function SearchGameStart({onStart} : SearchGameProps) {
  const hasStartedRef = useRef(false);
    
  const handleOverlayClick = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    onStart?.();
  };

  useInputController({
    onCommand: (cmd) => {
      if (hasStartedRef.current) return;
      if(cmd === 'right') {
        hasStartedRef.current = true;
        onStart?.();
      }
      if(cmd === 'left') console.log("eventueel terug of andere actie");
    },
    confirmOnAnyPress: false,
  });

  return (
    <div className='full-screen-container overlay--search' onClick={handleOverlayClick}>
      <div></div>
      <div className='game-intsruction--search'>
        <p className='content__text default-text text--reverse'>Beweeg het vergrootglas met de knoppen en vind de steen</p>
        <div className='arrow-wrapper'>
          <IconArrow index='high' size='button' color='red' arrow='white'/>
          <div className='arrow-wrapper__side'>
            <IconArrow index='high' size='button' color='blue' arrow='white'/>
            <IconArrow index='high' size='button' color='green' arrow='white'/>
          </div>
          <IconArrow index='high' size='button' color='yellow' arrow='white'/>
        </div>
      </div>
      
      {/* NavigationIntstruction removed; keep IconArrow controls above for in-game instruction */}
    </div>
  )
}

export default SearchGameStart