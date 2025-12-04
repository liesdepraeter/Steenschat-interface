{/*import Circle from "../../Circle/Circle"*/}
import IconCamera from "../../Icons/IconCamera"
import IconChest from "../../Icons/IconChest"
import "./Error.css"

interface ErrorProps {
    onClearError: () => void; 
}

function Error({ onClearError }: ErrorProps) {
  return (
    <div className='full-screen-container error-overlay' onClick={onClearError}>
        <div className="text">
            <p className="title-text text--reverse">Oeps!</p>
            <p className="bold-text text--reverse">Er is geen steen te zien</p>
            <p className="bold-text text--reverse">Kies een steen uit de schatkist en leg hem onder de camera</p>
        </div>

        <div className="image-grid">
            <IconChest classname="img__chest"/>
            {/*<img className="img__chest" src="./images/treasure-chest.png" alt="" />*/}
            <img className="img__arrow" src="./icons/curved-arrow.svg" alt="" />
            <img className="img__stone" src="./images/crystal.png" alt="" />
            {/*<img className="img__camera" src="./icons/video.svg" alt="" />*/}
            <IconCamera classname="img__camera"/>
        </div>
        
    </div>
    
  )
}

export default Error

{/*<Circle size='small' color='green'/>
    <Circle size='medium' color='light-red'/>
    <Circle size='large' color='yellow'/>*/}