import {stoneByName, allStoneTypes, type StoneType} from '../../../data/stones';
import './ScoreInstruction.css'

type ScoreVariant = '+1' | '-1';
{/*type GameVariant = 'rozenkwarts' | 'citrien' | 'aventurijn' | 'obsidiaan' | 'amethist';*/}

interface ScoreProps {
  score?: ScoreVariant; 
  variant?: StoneType;
}
{/*variant?: GameVariant;*/}

{/*const stoneImagePaths: Record<GameVariant, string> = {
    'rozenkwarts': '/images/rozenkwarts.png',
    'citrien': '/images/citrien.png',
    'aventurijn': '/images/aventurijn.png',
    'obsidiaan': '/images/obsidiaan.png',
    'amethist': '/images/amethist.png',
};*/}

{/*const getOtherStonePaths = (currentVariant: GameVariant): string[] => {
    return (Object.keys(stoneImagePaths) as GameVariant[])
        .filter(variantName => variantName !== currentVariant)
        .map(variantName => stoneImagePaths[variantName])
        .slice(0, 4); 
};*/}
const getOtherStonePaths = (current: StoneType): string[] => {
  return allStoneTypes
    .filter(type => type !== current)
    .map(type => stoneByName[type].img)
    .slice(0, 4); // neem er 4 (zoals je originele code)
};


const ScoreInstruction: React.FC<ScoreProps> = ({ score, variant = 'rozenkwarts' }) => {
    const currentStone = stoneByName[variant];

    let imageContent;
    if (score === '+1') {
        {/*const currentStonePath = stoneImagePaths[variant];*/}
        imageContent = (
            <div className='img__stones'>
                <img className='stones__stone' src={currentStone.img} alt={currentStone.name} /> {/*currentStonePath*/}{/*variant*/}
            </div>
        );
    } else {
        // score === '-1': Toon 4 andere stenen in een div
        const otherStones = getOtherStonePaths(variant);
        imageContent = (
            <div className='img__stones img__stones--grid'>
                {otherStones.map((path, index) => (
                    // Gebruik index als key is oké hier omdat de lijst statisch is
                    <img key={index} className='stones__stone' src={path} alt={`steen ${index + 1}`} />
                ))}
            </div>
        );
    }

    const cardClasses = [
        'score-card',
        score==='+1' ? 'score-card--add' : '',
        score==='-1' ? 'score-card--min' : '',
    ].join(' ').trim();

    const scoreClasses = [
        'bold-text',
        'score-card__score',
        score==='+1' ? 'score-card__score--add' : '',
        score==='-1' ? 'score-card__score--min' : '',
    ].join(' ').trim();
    

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