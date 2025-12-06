import { stoneByName, type StoneType, type StoneData } from '../../data/stones';
import './Circle.css'

export type CircleColor = StoneData["color"];

type CircleSize = 'small' | 'medium' | 'large' | 'base' | 'xlarge';
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
{/*text?: CircleText;*/}

const Circle: React.FC<CircleProps> = ({ size, color, text, index = 'default', children }) => {

  {/*const textColorMap: Record<CircleText, CircleColor> = {
    rozenkwarts: 'red',
    citrien: 'orange',
    aventurijn: 'lemon',
    obsidiaan: 'blue',
    amethist: 'purple',
  };
  // kies kleur: kleur-prop heeft altijd voorrang
  const finalColor: CircleColor | undefined = color ?? (text ? textColorMap[text] : undefined);*/}

  // haal automatisch kleur op uit JSON
  const jsonColor: CircleColor | undefined = text ? stoneByName[text].color : undefined;
  // prop heeft voorrang
  const finalColor: CircleColor | undefined = color ?? jsonColor;

  {/*// bepaal text color class automatisch
  const textClass = (() => {
    if (text) {
      switch(text) {
        case 'rozenkwarts':
        case 'citrien':
        case 'obsidiaan':
          return 'text--reverse'; 
        case 'aventurijn':
        case 'amethist':
        default:
          return ''; 
      }
    } else if (color) {
      switch(color) {
      case 'red':
      case 'orange':
      case 'blue':
        return 'text--reverse'; 
      case 'lemon':
      case 'purple':
      default:
        return ''; 
      }
    } return '';
  })();*/}
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

{/*export type { CircleColor};*/}