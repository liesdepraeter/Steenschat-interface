import {type StoneType} from '../../../data/stones';
import ScoreInstruction from '../../Instruction/CatchGame/ScoreInstruction'
import Circle from '../../Circle/Circle';
import IconArrow from '../../Icons/IconArrow'
import NavigationIntstruction from '../../Instruction/NavigationIntstruction';
import'./CatchGameStart.css'
import { useInputController } from '../../../Hooks/useInputController';


interface CatchGameProps {
    variant?: StoneType;
    onStart?: () => void;
}

function CatchGameStart({variant='rozenkwarts', onStart} : CatchGameProps) {

  const handleOverlayClick = () => {
    onStart?.();
  };

   useInputController({
    onCommand: (cmd) => {
      if(cmd === 'right') onStart?.(); 
      if(cmd === 'left') console.log("eventueel terug of andere actie");
    },
    confirmOnAnyPress: false
  });

  return (
    <div className='full-screen-container overlay-start' onClick={handleOverlayClick}>
        <Circle size='base' text={variant}/>

        <div className='container--catch-game'>
            <div className='game-instruction'>
                <div className='game-intstruction__text-box'>
                    <p className='game-instruction__text bold-text text--reverse'>Verzamel 10 punten door {variant} te vangen</p>
                    <div className='game-instruction__text bold-text text--reverse'>
                        <p>Beweeg de mand met de knoppen</p>
                        <IconArrow size='in-text' color='yellow' arrow='white'/>
                        <IconArrow size='in-text' color='green' arrow='white'/>
                    </div>
                </div>
                
                
                <div className='game-instruction__cards'>
                    <ScoreInstruction score='-1' variant={variant}/>
                    <ScoreInstruction score='+1' variant={variant}/>
                </div>
            </div>
            <NavigationIntstruction color='white' variant={variant}/>
        </div>
        
    </div>
  )
}

export default CatchGameStart