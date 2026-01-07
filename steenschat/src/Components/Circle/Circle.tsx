import { stoneByName, type StoneType, type StoneData } from '../../data/stones';
import './Circle.css'

export type CircleColor = StoneData["color"];

type CircleSize = 'small' | 'medium' | 'large' | 'base' | 'game' | 'xlarge';
{/*type CircleColor = 'red' | 'blue' | 'light-red' | 'lemon' | 'green' | 'orange' | 'yellow' | 'purple';
type CircleText = 'rozenkwarts' | 'citrien' | 'aventurijn' | 'obsidiaan' | 'amethist';*/}
type CircleIndex = 'default' | 'high';

interface CircleProps {
  size?: CircleSize; 
  color?: CircleColor;
  text?: StoneType;
  index?: CircleIndex;
  children?: React.ReactNode;
}

const Circle: React.FC<CircleProps> = ({ size, color, text, index = 'default', children }) => {

  // haal automatisch kleur op uit JSON
  const jsonColor: CircleColor | undefined = text ? stoneByName[text].color : undefined;
  // prop heeft voorrang
  const finalColor: CircleColor | undefined = color ?? jsonColor;

  const reverseColors: CircleColor[] = ['red', 'orange', 'blue'];
  const textClass = reverseColors.includes(finalColor!)? 'text--reverse' : '';

  const classes = [
    'half-circle',
    size ? `half-circle--${size}` : '',
    finalColor ? `half-circle--${finalColor}` : '',
    (text || children) ? 'half-circle--with-text' : '',
    index? `index--${index}` : '',
  ].join(' ').trim();

  return (
    <div className={classes}>
      {text && (<p className={`half-circle__text default-text ${textClass}`}>{text}</p>)}
      {children && (<div className={`default-text ${textClass}`}>{children}</div>)}
    </div>
  )
}

export default Circle