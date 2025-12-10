import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const ALERT_TIMEOUT = 3000; //30s
const RETURN_HOME_TIMEOUT = 10000; //10s

export const useInactivityTimeout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const activityTimerRef = useRef<number | null>(null);
  const homeTimerRef = useRef<number | null>(null);

  // Functie om alle timers te resetten en de alert te verbergen
  const resetTimers = useCallback(() => {
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
    if (homeTimerRef.current) clearTimeout(homeTimerRef.current);
    setShowAlert(false);
  }, []);

  // Functie die wordt aangeroepen bij inactiviteit
  const handleInactivity = useCallback(() => {
    if (location.pathname !== '/') {
        setShowAlert(true);
        homeTimerRef.current = setTimeout(() => {
            navigate('/');
            resetTimers();
        }, RETURN_HOME_TIMEOUT);
    }
  }, [location.pathname, navigate, resetTimers]);

  // Start de initiële timer (wanneer de gebruiker interacteert)
  const startActivityTimer = useCallback(() => {
    resetTimers();
    if (location.pathname !== '/') {
        activityTimerRef.current = setTimeout(handleInactivity, ALERT_TIMEOUT);
    }
  }, [handleInactivity, resetTimers, location.pathname]);


  useEffect(() => {
    startActivityTimer(); 

    const events = ['mousemove', 'keydown', 'click', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, startActivityTimer);
    });

    // Cleanup listeners en timers bij unmounten
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, startActivityTimer);
      });
      resetTimers();
    };
  }, [startActivityTimer, location.pathname, resetTimers]);

  return { showAlert, resetTimers };
};