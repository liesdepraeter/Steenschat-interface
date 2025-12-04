import React, { useEffect, useRef, useState } from 'react';
import './WebcamViewer.css';
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
      
      {/* Toon de algemene foutmelding indien aanwezig */}
      {errorMessage && (
        <div className="messages error-message default-text text--reverse">
          {errorMessage}
        </div>
      )}

      {/* De knipperende overlay */}
      {!errorMessage && (
        <div className={`video-overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
          <IconCamera/>
          <p className='default-text text--reverse'>Leg een steen onder de camera</p>
        </div>
      )}
    </div>
  );
};

export default WebcamViewer;