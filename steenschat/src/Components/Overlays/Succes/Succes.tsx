import { useNavigate } from 'react-router-dom';
import IconArrow from "../../Icons/IconArrow"
import './Succes.css'
import { useEffect } from 'react';


function Succes() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, 5000]);


  return (
    <div className="full-screen-container allert-overlay" onClick={handleClick}>
        <div className='succes-box'>
            <p className='title-text'>Proficiat!</p>
            <p className='bold-text'>Leg de steen terug in de schatkist</p>
            <p className='bold-text'>Druk daarna op een knop om een nieuwe steen te ontdekken</p>
            <IconArrow/>
        </div>
    </div>
  )
}

export default Succes