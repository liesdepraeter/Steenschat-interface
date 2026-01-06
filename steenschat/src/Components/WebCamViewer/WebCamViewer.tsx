import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoneRecognition } from '../../Hooks/useStoneRecognition';
import { useInputController } from "../../Hooks/useInputController";
{/*import { playStoneSound } from "./playStoneSound";*/}
import './WebCamViewer.css';

interface WebcamViewerProps {
  onNoStoneError: () => void;
}

const WebcamViewer: React.FC<WebcamViewerProps> = ({ onNoStoneError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true);
  const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();

  // Retry state
  const [retryCount, setRetryCount] = useState<number>(0);
  const [cameraStatus, setCameraStatus] = useState<'initializing' | 'connecting' | 'connected' | 'error'>('initializing');
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxRetries = 20;

  const {
    detectedStone,
    confidence,
    isModelLoaded,
    modelError,
  } = useStoneRecognition(videoRef as React.RefObject<HTMLVideoElement>, cameraStatus === 'connected' && !errorMessage);

  // --- Webcam Logica met Retry ---
  useEffect(() => {
    let mounted = true;

    const startWebcam = async () => {
      try {
        // Stop oude stream als die er is
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        setCameraStatus('connecting');

        // Check if media devices are supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Media devices API wordt niet ondersteund door deze browser');
        }

        // Kleine wachttijd voor stabiliteit
        await new Promise(resolve => setTimeout(resolve, 500));

        // Probeer camera stream te krijgen
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraStatus('connected');
          setRetryCount(0);
          setErrorMessage('');
          console.log('✅ Camera verbonden');
        }
      } catch (err: any) {
        console.error('Camera error:', err.name, err.message);
        
        if (!mounted) return;

        setCameraStatus('error');

        // Retry logica - probeer max 20 keer met exponential backoff
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 + (retryCount * 500), 5000);
          console.log(`🔄 Camera retry ${retryCount + 1}/${maxRetries} over ${delay}ms`);
          
          retryTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              setRetryCount(prev => prev + 1);
            }
          }, delay);
        } else {
          setErrorMessage('Camera kon niet worden gestart na meerdere pogingen. Controleer de USB verbinding.');
          console.error('❌ Camera gefaald na 20 pogingen');
        }
      }
    };

    startWebcam();

    return () => {
      mounted = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [retryCount]);

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
    if (!errorMessage && !detectedStone && cameraStatus === 'connected') {
      const intervalId = setInterval(() => {
        setIsOverlayVisible(v => !v);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [errorMessage, detectedStone, cameraStatus]);

  const handleConfirm = () => {
    if (!detectedStone) return;
    
    // Play sound associated with the detected stone -> naar Fact
    {/*playStoneSound(detectedStone);*/}
    
    // Eerst naar loading video
    {/*navigate(`/${detectedStone}/fact`);*/}
    navigate(`/${detectedStone}/fact`, {state: {variant: detectedStone} });
    setShowConfirmButton(false);
  };

  const handleExternalTrigger = () => {
    //Indien steen niet gedetecteerd -> error doorgeven aan Home
    if (!detectedStone) {
      onNoStoneError();
      return;
    }
    // Indien steen wél gedetecteerd → doe normale confirm logica
    handleConfirm();
  };

  useInputController({
    confirmOnAnyPress: true,
    onCommand: (cmd) => {
      if (cmd === "confirm") handleExternalTrigger();
    }
  });

  return (
    <div className="video-container">
      <video className='video--small' ref={videoRef} autoPlay playsInline muted />

      {/* Camera status berichten (initializing/connecting) */}
      {cameraStatus !== 'connected' && !errorMessage && (
        <div className="messages loading-message default-text text--reverse">
          {cameraStatus === 'initializing' && '🎥 Camera initialiseren...'}
          {cameraStatus === 'connecting' && `🔄 Camera verbinden... (poging ${retryCount + 1}/${maxRetries})`}
          {cameraStatus === 'error' && retryCount < maxRetries && `⏳ Camera opnieuw proberen... (${retryCount + 1}/${maxRetries})`}
        </div>
      )}

      {/* Toon de algemene foutmelding indien aanwezig */}
      {errorMessage && (
        <div className="messages error-message default-text text--reverse">
          {errorMessage}
        </div>
      )}

      {/* Model wordt geladen */}
      {!errorMessage && cameraStatus === 'connected' && !isModelLoaded && (
        <div className="messages loading-message default-text text--reverse">
          Model wordt geladen...
        </div>
      )}

      {/* De knipperende overlay - alleen tekst */}
      {!errorMessage && cameraStatus === 'connected' && isModelLoaded && !detectedStone && (
        <div className={`video-overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
          <p className="default-text text--reverse">Leg een steen onder de camera & wacht even...</p>
        </div>
      )}

      {/* Stone detected prompt */}
      {showConfirmButton && detectedStone && cameraStatus === 'connected' && (
        <div className="stone-detected-overlay">
          <p className="default-text text--reverse">Duw op de rode knop</p>
        </div>
      )}
    </div>
  );
};

export default WebcamViewer;