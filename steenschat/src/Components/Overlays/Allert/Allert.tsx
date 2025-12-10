import { useInputController } from '../../../Hooks/useInputController';
import IconArrow from '../../Icons/IconArrow'
import './Allert.css'

interface AllertProps {
    onPress: () => void; 
}

function Allert({ onPress }: AllertProps) {

  useInputController({
    onCommand: () => {
      onPress();
    },
    confirmOnAnyPress: true,
  });

  return (
    <div className='full-screen-container allert-overlay' onClick={(e) => {
      e.stopPropagation(); 
       onPress();           
    }}>
      <div className='allert-box'>
        <p className='title-text'>Ben je er nog?</p>
        <p className='bold-text'>Druk op een knop en blijf hier</p>
        <IconArrow/>
      </div>
    </div>
  )
}

export default Allert