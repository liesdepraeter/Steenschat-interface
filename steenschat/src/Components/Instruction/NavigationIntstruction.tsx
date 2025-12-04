import { useNavigate } from 'react-router-dom'
import './NavigationInstruction.css'
import IconArrow from '../Icons/IconArrow'

type Color = 'blue' | 'white';
type StoneVariant = 'rozenkwarts' | 'citrien' | 'aventurijn' | 'obsidiaan' | 'amethist';

interface InstructionProps {
  color?: Color;
  variant?: StoneVariant;
}

const NavigationIntstruction: React.FC<InstructionProps> = ({ color, variant='rozenkwarts' }) => {
  const gameMap: Record<StoneVariant, string> = {
    rozenkwarts: 'catchgame',
    citrien: 'catchgame',
    aventurijn: 'catchgame',
    amethist: 'catchgame',
    obsidiaan: 'catchgame',
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  }

  const handleNext = () => {
    const game = gameMap[variant] || 'catchgame';
    navigate(`/${variant}/${game}`);
  }

  return (
    <div className='nav'>
        <div className='nav__back' onClick={handleBack}>
            <IconArrow size='button' color='yellow' arrow={color==='white'? 'white' : 'blue'}/>
            <p className={`default-text ${color === 'white' ? 'text--reverse' : ''}`}>Ontdek een nieuwe steen</p>
        </div>
        <div className='nav__next' onClick={handleNext}>
            <p className={`default-text ${color === 'white' ? 'text--reverse' : ''}`}>Speel het spel</p>
            <IconArrow size='button' color='green' arrow={color==='white'? 'white' : 'blue'}/>
        </div>
    </div>
  )
}

export default NavigationIntstruction