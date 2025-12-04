import './IconArrow.css'
type CircleColor = 'red' | 'blue' | 'green' | 'yellow';
type CircleSize = 'default' | 'button' | 'in-text';
type ArrowColor = 'blue' | 'white';
type ArrowIndex = 'default' | 'high';

interface CircleProps {
  size?: CircleSize; 
  color?: CircleColor;
  arrow?: ArrowColor;
  index?: ArrowIndex;
}

const IconArrow: React.FC<CircleProps> = ({ index='default', size, color, arrow }) => {

  const classes = [
    'circle',
    size ? `circle--${size}` : '',
    color ? `circle--${color}` : '',
    index? `arrow--${index}` : '',
  ].join(' ').trim();

  let arrowSize = 45; 
  if (size === 'in-text') {
    arrowSize = 18; //16
  } else if (size === 'button') {
    arrowSize = 24; //36 
  }


  return (
    <div className={classes}>
      <svg width={arrowSize} height={arrowSize} viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className={arrow==='white'? 'arrow' : ''} d="M22.5 9.375V35.625" stroke="#03009C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path className={arrow==='white'? 'arrow' : ''} d="M35.625 22.5L22.5 35.625L9.375 22.5" stroke="#03009C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {/*<img className='arrow' src="/icons/arrow.svg" alt="pijl" width={arrowSize}/>*/}
    </div>
  )
}

export default IconArrow