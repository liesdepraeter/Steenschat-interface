import { useNavigate } from 'react-router-dom';
import IconArrow from "../../Icons/IconArrow"
import './Succes.css'
import { useEffect, useState } from 'react';
import { useInputController } from '../../../Hooks/useInputController';


function Succes() {
  const navigate = useNavigate();
  const [canNavigate, setCanNavigate] = useState(false);

  const handleClick = () => {
    if (canNavigate) {
      navigate('/');
    }
  };

  // Enable navigation after 4 seconds
  useEffect(() => {
    const enableTimer = setTimeout(() => {
      setCanNavigate(true);
    }, 4000);

    return () => clearTimeout(enableTimer);
  }, []);

  // Auto-navigate after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useInputController({
      onCommand: () => {
        if (canNavigate) {
          navigate('/');
        }
      },
      confirmOnAnyPress: true
    });

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