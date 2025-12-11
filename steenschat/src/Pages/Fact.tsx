import { type StoneType, stoneByName } from '../data/stones'
import { playStoneSound } from "../Components/WebCamViewer/playStoneSound";

import'./Fact.css'
import Circle from '../Components/Circle/Circle'
import NavigationIntstruction from '../Components/Instruction/NavigationIntstruction'
import { useEffect } from 'react';


interface FactProps {
  stone?: StoneType;
}


function Fact({stone='rozenkwarts'} : FactProps) {

  const data = stoneByName[stone];

  const textShouldReverse = ["rozenkwarts", "citrien", "obsidiaan"].includes(stone);
  const textColor = textShouldReverse ? "text--reverse" : "";

  useEffect(() => {
    playStoneSound(stone);
  }, [stone]);

  return (
    <>
      <Circle size='xlarge' color={data.color}/> {/*stoneColors[stone]*/}

      <div className='full-screen-container container--fact'>
        <NavigationIntstruction variant={stone} color='sand'/>

        <div className='fact-content'>
          <p className={`fact-content__title title-text ${textColor}`}>{stone}</p>
          <img className='fact-content__img' src={data.img} alt={stone} /> {/*stoneImages[stone]*/}
          <div className='fact-content__fact'>
            <p className={`fact__big-text bold-text ${textColor}`}>Wist je dat ...</p>
            <p className={`default-text ${textColor}`}>{data.fact}</p> {/*stoneFacts[stone]*/}
          </div>
        </div>
      </div>
      
      
    </>
  )
}

export default Fact