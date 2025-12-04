import './Circle.css'

type CircleSize = 'small' | 'medium' | 'large' | 'base' | 'xlarge';
type CircleColor = 'red' | 'blue' | 'light-red' | 'lemon' | 'green' | 'orange' | 'yellow' | 'purple';
type CircleText = 'rozenkwarts' | 'citrien' | 'aventurijn' | 'obsidiaan' | 'amethist';

interface CircleProps {
  size?: CircleSize; 
  color?: CircleColor;
  text?: CircleText;
  children?: React.ReactNode;
}

const Circle: React.FC<CircleProps> = ({ size, color, text, children }) => {

  const textColorMap: Record<CircleText, CircleColor> = {
    rozenkwarts: 'red',
    citrien: 'orange',
    aventurijn: 'lemon',
    obsidiaan: 'blue',
    amethist: 'purple',
  };
  // kies kleur: kleur-prop heeft altijd voorrang
  const finalColor: CircleColor | undefined = color ?? (text ? textColorMap[text] : undefined);

  // bepaal text color class automatisch
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
  })();

  const classes = [
    'half-circle',
    size ? `half-circle--${size}` : '',
    finalColor ? `half-circle--${finalColor}` : '',
    (text || children) ? 'half-circle--with-text' : '',
  ].join(' ').trim();

  return (
    <div className={classes}>
      {text && (<p className={`half-circle__text default-text ${textClass}`}>{text}</p>)}
      {children && (<div className={`default-text ${textClass}`}>{children}</div>)}
    </div>
  )
}

export default Circle

export type { CircleColor};