{/*import React, { useEffect, useRef, useState } from 'react';
import './WebCamViewer.css';
import IconCamera from '../Icons/IconCamera';


const WebcamViewer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>(""); 
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true);
  const streamRef = useRef<MediaStream | null>(null);

  // --- Webcam Logica ---
  useEffect(() => {
    const startWebcam = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Je browser ondersteunt geen webcamtoegang.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage("Kon webcam niet starten: " + err.message);
      }
    };

    startWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // --- Knipperende Overlay Logica ---
  useEffect(() => {
    if (!errorMessage) {
      const intervalId = setInterval(() => {
        setIsOverlayVisible(v => !v); 
      }, 3000); 

      return () => clearInterval(intervalId);
    }
  }, [errorMessage]);


  return (
    <div className="video-container">
      <video ref={videoRef} autoPlay playsInline muted />
      
      {/* Toon de algemene foutmelding indien aanwezig *
      {errorMessage && (
        <div className="messages error-message default-text text--reverse">
          {errorMessage}
        </div>
      )}

      {/* De knipperende overlay *
      {!errorMessage && (
        <div className={`video-overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
          <IconCamera/>
          <p className='default-text text--reverse'>Leg een steen onder de camera</p>
        </div>
      )}
    </div>
  );
};

export default WebcamViewer;*/}

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WebCamViewer.css';
import IconCamera from '../Icons/IconCamera';
import { useStoneRecognition } from '../../Hooks/useStoneRecognition';

const WebcamViewer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true);
  const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  const {
    detectedStone,
    confidence,
    isModelLoaded,
    modelError,
  } = useStoneRecognition(videoRef as React.RefObject<HTMLVideoElement>, !errorMessage);

  // --- Webcam Logica ---
  useEffect(() => {
    const startWebcam = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage('Je browser ondersteunt geen webcamtoegang.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage('Kon webcam niet starten: ' + err.message);
      }
    };

    startWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Toon modelfout als algemene fout
  useEffect(() => {
    if (modelError) {
      setErrorMessage(modelError);
    }
  }, [modelError]);

  // Button zichtbaar als er een echte steen is gedetecteerd
  useEffect(() => {
    if (detectedStone && confidence > 0.7) {
      setShowConfirmButton(true);
      setIsOverlayVisible(false);
    } else {
      setShowConfirmButton(false);
      setIsOverlayVisible(true);
    }
  }, [detectedStone, confidence]);

  // --- Knipperende Overlay Logica ---
  useEffect(() => {
    if (!errorMessage && !detectedStone) {
      const intervalId = setInterval(() => {
        setIsOverlayVisible(v => !v);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [errorMessage, detectedStone]);

  const playStoneSound = (stoneName: string) => {
    try {
      const audio = new Audio(`/sounds/${stoneName}.mp3`);
      audio.play().catch((error) => {
        console.warn('Kon geluid niet afspelen:', error);
      });
    } catch (error) {
      console.warn('Kon geluid niet laden:', error);
    }
  };

  const handleConfirm = () => {
    if (!detectedStone) return;
    
    // Play sound associated with the detected stone
    playStoneSound(detectedStone);
    
    navigate(`/${detectedStone}/fact`);
    setShowConfirmButton(false);
  };

  const displayName = detectedStone
    ? detectedStone.charAt(0).toUpperCase() + detectedStone.slice(1)
    : '';

  return (
    <div className="video-container">
      <video ref={videoRef} autoPlay playsInline muted />

      {/* Toon de algemene foutmelding indien aanwezig */}
      {errorMessage && (
        <div className="messages error-message default-text text--reverse">
          {errorMessage}
        </div>
      )}

      {/* Model wordt geladen */}
      {!errorMessage && !isModelLoaded && (
        <div className="messages loading-message default-text text--reverse">
          Model wordt geladen...
        </div>
      )}

      {/* De knipperende overlay */}
      {!errorMessage && isModelLoaded && !detectedStone && (
        <div className={`video-overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
          <IconCamera />
          <p className="default-text text--reverse">Leg een steen onder de camera</p>
        </div>
      )}

      {/* Bevestigknop */}
      {showConfirmButton && detectedStone && (
        <div className="confirm-button-container">
          <button
            className="confirm-button default-text"
            onClick={handleConfirm}
            disabled={!detectedStone}
          >
            Bevestig: {displayName}
          </button>
          {/* <p className="confidence-text">Zekerheid: {Math.round(confidence * 100)}%</p> */}
        </div>
      )}
    </div>
  );
};

export default WebcamViewer;