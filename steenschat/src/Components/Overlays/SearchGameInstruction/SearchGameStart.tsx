import './SearchGameStart.css'
import NavigationIntstruction from "../../Instruction/NavigationIntstruction";


type GameVariant = 'rozenkwarts' | 'citrien' | 'aventurijn' | 'obsidiaan' | 'amethist';

interface SearchGameProps {
    variant?: GameVariant;
    onStart?: () => void;
}

function SearchGameStart({variant='rozenkwarts', onStart} : SearchGameProps) {
    
    const handleOverlayClick = () => {
        onStart?.();
    };

  return (
    <div className='full-screen-container overlay-start' onClick={handleOverlayClick}>
        <NavigationIntstruction color='white' variant={variant}/>
    </div>
  )
}

export default SearchGameStart