import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoneRecognition } from '../../Hooks/useStoneRecognition';
import { useInputController } from "../../Hooks/useInputController";
{/*import { playStoneSound } from "./playStoneSound";*/}
import './WebCamViewer.css';
import IconCamera from '../Icons/IconCamera';

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
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxRetries = 30; // Verhoogd naar 30

  const {
    detectedStone,
    confidence,
    isModelLoaded,
    modelError,
  } = useStoneRecognition(videoRef as React.RefObject<HTMLVideoElement>, cameraStatus === 'connected' && !errorMessage);

  // DEBUG: Enumerate cameras
  useEffect(() => {
    const enumerateCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        console.log('📹 Beschikbare camera devices:', videoDevices);
        setDebugInfo(`Gevonden cameras: ${videoDevices.length}`);
      } catch (err) {
        console.error('Enumerate error:', err);
      }
    };

    enumerateCameras();

    // Luister naar device changes
    navigator.mediaDevices.addEventListener('devicechange', enumerateCameras);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', enumerateCameras);
    };
  }, []);

  // --- Webcam Logica met Retry en DEBUG ---
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
          throw new Error('Media devices API wordt niet ondersteund');
        }

        // Wacht langer bij eerste pogingen
        const waitTime = retryCount < 5 ? 2000 : 500;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        console.log(`🔍 Poging ${retryCount + 1}: Vraag camera aan...`);

        // Probeer VERSCHILLENDE strategieën
        let stream: MediaStream | null = null;

        // Strategie 1: Specifieke camera als we er meerdere hebben
        if (availableCameras.length > 0 && retryCount >= 3) {
          console.log('Strategie: Specifieke camera proberen');
          for (const camera of availableCameras) {
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: camera.deviceId } }
              });
              console.log(`✅ Camera werkt: ${camera.label || camera.deviceId}`);
              break;
            } catch (e) {
              console.log(`❌ Camera mislukt: ${camera.label || camera.deviceId}`);
            }
          }
        }

        // Strategie 2: Basis request (probeer eerst dit)
        if (!stream) {
          console.log('Strategie: Basis video request');
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: true 
          });
        }

        if (!mounted) {
          stream?.getTracks().forEach(track => track.stop());
          return;
        }

        if (!stream) {
          throw new Error('Geen stream verkregen');
        }

        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraStatus('connected');
          setRetryCount(0);
          setErrorMessage('');
          
          // Log welke camera we gebruiken
          const videoTrack = stream.getVideoTracks()[0];
          const settings = videoTrack.getSettings();
          console.log('✅ Camera verbonden:', {
            label: videoTrack.label,
            settings: settings
          });
          setDebugInfo(`Camera: ${videoTrack.label}`);
        }
      } catch (err: any) {
        console.error('❌ Camera error:', {
          name: err.name,
          message: err.message,
          retry: retryCount,
          availableCameras: availableCameras.length
        });
        
        if (!mounted) return;

        setCameraStatus('error');
        setDebugInfo(`Error: ${err.name} (${retryCount + 1}/${maxRetries})`);

        // Retry logica
        if (retryCount < maxRetries) {
          const delay = Math.min(2000 + (retryCount * 500), 6000);
          console.log(`🔄 Retry over ${delay}ms`);
          
          retryTimeoutRef.current = setTimeout(() => {
            if (mounted) {
              setRetryCount(prev => prev + 1);
            }
          }, delay);
        } else {
          setErrorMessage(`Camera niet beschikbaar: ${err.name}. Gevonden devices: ${availableCameras.length}`);
          console.error('❌ Camera gefaald na alle pogingen');
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
  }, [retryCount, availableCameras]);

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
    
    {/*playStoneSound(detectedStone);*/}
    navigate("/scanning", {state: {variant: detectedStone} });
    setShowConfirmButton(false);
  };

  const handleExternalTrigger = () => {
    if (!detectedStone) {
      onNoStoneError();
      return;
    }
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

      {/* DEBUG INFO - Altijd zichtbaar */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: '#0f0',
        padding: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        borderRadius: '4px',
        zIndex: 100,
        maxWidth: '90%'
      }}>
        <div>Status: {cameraStatus}</div>
        <div>Retry: {retryCount}/{maxRetries}</div>
        <div>{debugInfo}</div>
        <div>Devices: {availableCameras.map(c => c.label || 'Unknown').join(', ')}</div>
      </div>

      {/* Camera status berichten */}
      {cameraStatus !== 'connected' && !errorMessage && (
        <div className="messages loading-message default-text text--reverse">
          {cameraStatus === 'initializing' && '🎥 Camera initialiseren...'}
          {cameraStatus === 'connecting' && `🔄 Camera verbinden... (${retryCount + 1}/${maxRetries})`}
          {cameraStatus === 'error' && retryCount < maxRetries && `⏳ Opnieuw proberen... (${retryCount + 1}/${maxRetries})`}
        </div>
      )}

      {/* Foutmelding */}
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

      {/* Knipperende overlay */}
      {!errorMessage && cameraStatus === 'connected' && isModelLoaded && !detectedStone && (
        <div className={`video-overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
          <IconCamera />
          <p className="default-text text--reverse">Leg een steen onder de camera</p>
        </div>
      )}

      {/* Bevestigknop */}
      {showConfirmButton && detectedStone && cameraStatus === 'connected' && (
        <div className="confirm-button-container">
          <button
            className="confirm-button default-text"
            onClick={handleConfirm}
            disabled={!detectedStone}
          >
            Steen gedetecteerd
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamViewer;