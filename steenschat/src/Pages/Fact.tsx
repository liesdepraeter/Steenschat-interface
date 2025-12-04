import'./Fact.css'
import Circle from '../Components/Circle/Circle'
import type { CircleColor } from '../Components/Circle/Circle';
import NavigationIntstruction from '../Components/Instruction/NavigationIntstruction'

type StoneVariant = 'rozenkwarts' | 'citrien' | 'aventurijn' | 'obsidiaan' | 'amethist';

interface FactProps {
    stone?: StoneVariant;
}

const stoneImages: Record<StoneVariant, string> = {
  rozenkwarts: "/images/rozenkwarts.png",
  citrien: "/images/citrien.png",
  aventurijn: "/images/aventurijn.png",
  obsidiaan: "/images/obsidiaan.png",
  amethist: "/images/amethist.png",
};

const stoneFacts: Record<StoneVariant, string> = {
  rozenkwarts: "Rozenkwarts is, na water en ijs, het meest voorkomende mineraal op aarde",
  citrien: "Citrien zeldzaam is in de natuur, en vaak wordt nagemaakt door verhitte amethist die geel is geworden",
  aventurijn: "Aventurijn een van de hardste mineralen is op aarde, hij wordt daarom vaak gebruikt voor sieraden",
  obsidiaan: "Obsidiaan eigenlijk snel afgekoelde, natuurlijke vulkanisch glas is",
  amethist: "De paarse kleur van amethist ontstaat door een mix van ijzer en natuurlijke straling in de aarde",
}

const stoneColors: Record<StoneVariant, CircleColor> = {
  rozenkwarts: "red",
  citrien: "orange",
  aventurijn: "lemon",
  obsidiaan: "blue",
  amethist: "purple",
}


function Fact({stone='rozenkwarts'} : FactProps) {

  let textColor = '';
  switch (stone) {
    case "aventurijn":
    case "amethist":
      break;
    case "rozenkwarts":
    case "citrien":
    case "obsidiaan":
    default:
      textColor = "text--reverse"
      break;
  };

  return (
    <>
      <Circle size='xlarge' color={stoneColors[stone]}/>

      <div className='full-screen-container container--fact'>
        <NavigationIntstruction variant={stone}/>

        <div className='fact-content'>
          <p className={`fact-content__title title-text ${textColor}`}>{stone}</p>
          <img className='fact-content__img' src={stoneImages[stone]} alt={stone} />
          <div className='fact-content__fact'>
            <p className={`fact__big-text bold-text ${textColor}`}>Wist je dat ...</p>
            <p className={`default-text ${textColor}`}>{stoneFacts[stone]}</p>
          </div>
        </div>
      </div>
      
      
    </>
  )
}

export default Fact