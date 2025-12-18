import { useEffect, useState } from 'react';
import './Home.css'
import WebcamViewer from '../Components/WebCamViewer/WebCamViewer'
import Error from '../Components/Overlays/Error/Error'


function Home() {

  const [isErrorActive, setIsErrorActive] = useState(false);

  const triggerError = () => {
    setIsErrorActive(true);
  };

  const clearError = () => {
    setIsErrorActive(false);
  };

  useEffect(() => {
    let timer: number | null = null;
    if (isErrorActive) {
      timer = setTimeout(() => {
        console.log("Timeout verlopen, verberg error automatisch.");
        clearError();
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isErrorActive]);


  return (
    <>
      
      {isErrorActive ? (
        <Error onClearError={clearError}/>
      ) : (
      <div className='full-screen-container container--home'>
        <WebcamViewer onNoStoneError={triggerError}/>
      </div>)}

      {/* Tijdelijke knop om de fout te testen. */}
      {/*{!isErrorActive && (
        <button onClick={triggerError} style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
          Simuleer Fout
        </button>
      )}*/}
    </>
  )
}

export default Home