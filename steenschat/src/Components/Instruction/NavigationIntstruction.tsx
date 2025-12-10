import { useNavigate } from 'react-router-dom'
import {type StoneType, stoneByName} from '../../data/stones';
import './NavigationInstruction.css'
import IconArrow from '../Icons/IconArrow'
import { useInputController } from '../../Hooks/useInputController';

type Color = 'blue' | 'white';
type Index = 'default' | 'high';

interface InstructionProps {
  color?: Color;
  variant?: StoneType;
  index?: Index;
}

const NavigationIntstruction: React.FC<InstructionProps> = ({ index='default', color, variant='rozenkwarts' }) => {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  }

  const handleNext = () => {
    const stone = stoneByName[variant];
    const game = stone.game;
    navigate(`/${variant}/${game}`);
  }

  useInputController({
    onCommand: (cmd) => {
      if (cmd === 'left') handleBack();
      if (cmd === 'right') handleNext();
    },
    confirmOnAnyPress: false,
  });

  const textClass = color === 'white' ? 'text--reverse' : '';

  return (
    <div className={`nav instruction--${index}`}>
        <div className='nav__back' onClick={handleBack}>
            <IconArrow size='button' color='yellow' arrow={color==='white'? 'white' : 'blue'}/>
            <p className={`default-text ${textClass}`}>Ontdek een nieuwe steen</p>
        </div>
        <div className='nav__next' onClick={handleNext}>
            <p className={`default-text ${textClass}`}>Speel het spel</p>
            <IconArrow size='button' color='green' arrow={color==='white'? 'white' : 'blue'}/>
        </div>
    </div>
  )
}

export default NavigationIntstruction