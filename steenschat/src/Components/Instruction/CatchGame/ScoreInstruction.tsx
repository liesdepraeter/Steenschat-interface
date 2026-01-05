import {stoneByName, type StoneType} from '../../../data/stones';
import './ScoreInstruction.css'

interface ScoreProps {
  score?: '+1'; 
  variant?: StoneType;
}

const ScoreInstruction: React.FC<ScoreProps> = ({ score = '+1', variant = 'rozenkwarts' }) => {
    const currentStone = stoneByName[variant];

    const imageContent = (
        <div className='img__stones'>
            <img className='stones__stone' src={currentStone.img} alt={currentStone.name} />
        </div>
    );

    const cardClasses = 'score-card score-card--add';
    const scoreClasses = 'bold-text score-card__score score-card__score--add';
    

  return (
    <div className={cardClasses}>
        <p className={scoreClasses}>{score}</p>
        <div className='score-card__img'>
            {imageContent}
            {/*<img className='img__basket' src="/images/mand.png" alt="" />*/}
        </div>
        <div></div>
    </div>
  )
}

export default ScoreInstruction