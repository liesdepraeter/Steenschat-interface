# Code Templates for Stone Recognition Implementation

This file contains code templates and examples for implementing the stone recognition feature. Use these as reference when writing your actual code.

---

## Template 1: Custom Hook - `useStoneRecognition.ts`

**File Location:** `src/Hooks/useStoneRecognition.ts`

```typescript
import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { StoneType } from '../data/stones';

interface UseStoneRecognitionReturn {
  detectedStone: StoneType | null;
  confidence: number;
  isModelLoaded: boolean;
  isPredicting: boolean;
  modelError: string | null;
}

// Configuration constants - adjust these based on your needs
const MODEL_URL = '/models/stone-recognition/model.json';
const CONFIDENCE_THRESHOLD = 0.7; // Only accept predictions above 70%
const STABILITY_COUNT = 3; // Require 3 consecutive detections of same stone
const PREDICTION_INTERVAL = 250; // Run prediction every 250ms

export const useStoneRecognition = (
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean = true
): UseStoneRecognitionReturn => {
  const [detectedStone, setDetectedStone] = useState<StoneType | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Refs to persist values across renders without causing re-renders
  const modelRef = useRef<tf.LayersModel | null>(null);
  const predictionIntervalRef = useRef<number | null>(null);
  const stabilityCounterRef = useRef<{ stone: StoneType | null; count: number }>({
    stone: null,
    count: 0,
  });

  // Load the model once when component mounts
  useEffect(() => {
    let isMounted = true;

    const loadModel = async () => {
      try {
        setModelError(null);
        console.log('Loading Teachable Machine model...');
        
        const model = await tf.loadLayersModel(MODEL_URL);
        
        if (isMounted) {
          modelRef.current = model;
          setIsModelLoaded(true);
          console.log('Model loaded successfully');
        }
      } catch (error: any) {
        console.error('Error loading model:', error);
        if (isMounted) {
          setModelError(`Model kon niet geladen worden: ${error.message}`);
          setIsModelLoaded(false);
        }
      }
    };

    loadModel();

    return () => {
      isMounted = false;
    };
  }, []);

  // Prediction loop - runs continuously when enabled
  useEffect(() => {
    if (!enabled || !isModelLoaded || !modelRef.current || !videoRef.current) {
      setIsPredicting(false);
      return;
    }

    let lastPredictionTime = 0;
    let animationFrameId: number;

    const predict = async () => {
      const now = Date.now();
      
      // Throttle predictions to avoid overloading
      if (now - lastPredictionTime < PREDICTION_INTERVAL) {
        animationFrameId = requestAnimationFrame(predict);
        return;
      }

      lastPredictionTime = now;

      try {
        const video = videoRef.current;
        if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
          animationFrameId = requestAnimationFrame(predict);
          return;
        }

        const model = modelRef.current;
        if (!model) return;

        // Capture frame from video
        const tensor = tf.browser.fromPixels(video);
        const resized = tf.image.resizeBilinear(tensor, [224, 224]); // Adjust size to match your model
        const normalized = resized.div(255.0);
        const batched = normalized.expandDims(0);

        // Run prediction
        const predictions = await model.predict(batched) as tf.Tensor;
        const predictionsArray = await predictions.data();

        // Get class names from model (usually from metadata.json, but we'll infer from predictions)
        // You may need to adjust this based on your model structure
        const maxIndex = predictionsArray.indexOf(Math.max(...Array.from(predictionsArray)));
        const maxConfidence = predictionsArray[maxIndex];

        // Clean up tensors to prevent memory leaks
        tensor.dispose();
        resized.dispose();
        normalized.dispose();
        batched.dispose();
        predictions.dispose();

        // Map index to stone name - YOU NEED TO ADJUST THIS BASED ON YOUR MODEL
        // This assumes your model classes are in the same order as your stones
        const stoneNames: StoneType[] = ['rozenkwarts', 'amethist', 'citrien', 'aventurijn', 'obsidiaan'];
        const detectedStoneName = stoneNames[maxIndex] as StoneType;

        // Check confidence threshold
        if (maxConfidence >= CONFIDENCE_THRESHOLD) {
          // Stability check
          if (stabilityCounterRef.current.stone === detectedStoneName) {
            stabilityCounterRef.current.count += 1;
          } else {
            stabilityCounterRef.current.stone = detectedStoneName;
            stabilityCounterRef.current.count = 1;
          }

          // Only update if stable
          if (stabilityCounterRef.current.count >= STABILITY_COUNT) {
            setDetectedStone(detectedStoneName);
            setConfidence(maxConfidence);
          }
        } else {
          // Reset if confidence drops
          stabilityCounterRef.current.stone = null;
          stabilityCounterRef.current.count = 0;
          setDetectedStone(null);
          setConfidence(0);
        }

        setIsPredicting(true);
      } catch (error: any) {
        console.error('Prediction error:', error);
      }

      animationFrameId = requestAnimationFrame(predict);
    };

    animationFrameId = requestAnimationFrame(predict);
    setIsPredicting(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      setIsPredicting(false);
    };
  }, [enabled, isModelLoaded, videoRef]);

  return {
    detectedStone,
    confidence,
    isModelLoaded,
    isPredicting,
    modelError,
  };
};
```

**Important Notes:**
- Adjust `MODEL_URL` if your model is in a different location
- Adjust `CONFIDENCE_THRESHOLD` based on your model's accuracy
- Adjust `STABILITY_COUNT` to require more/less consecutive detections
- The `stoneNames` array must match your model's class order exactly
- You may need to adjust the tensor size (224x224) to match your model's input size

---

## Template 2: Updated WebCamViewer Component

**File Location:** `src/Components/WebCamViewer/WebCamViewer.tsx`

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WebCamViewer.css';
import IconCamera from '../Icons/IconCamera';
import { useStoneRecognition } from '../../Hooks/useStoneRecognition';
import { StoneType } from '../../data/stones';

const WebcamViewer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  
  const [errorMessage, setErrorMessage] = useState<string>(""); 
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true);
  const [showConfirmButton, setShowConfirmButton] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Use the stone recognition hook
  const {
    detectedStone,
    confidence,
    isModelLoaded,
    isPredicting,
    modelError,
  } = useStoneRecognition(videoRef, !errorMessage && isModelLoaded);

  // --- Webcam Logica ---
  useEffect(() => {
    const startWebcam = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMessage("Je browser ondersteunt geen webcamtoegang.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
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

  // Show model loading error if present
  useEffect(() => {
    if (modelError) {
      setErrorMessage(modelError);
    }
  }, [modelError]);

  // Control confirmation button visibility
  useEffect(() => {
    if (detectedStone && confidence > 0.7) {
      setShowConfirmButton(true);
      setIsOverlayVisible(false); // Hide overlay when stone detected
    } else {
      setShowConfirmButton(false);
      setIsOverlayVisible(true); // Show overlay when no stone
    }
  }, [detectedStone, confidence]);

  // --- Knipperende Overlay Logica (only when no stone detected) ---
  useEffect(() => {
    if (!errorMessage && !detectedStone) {
      const intervalId = setInterval(() => {
        setIsOverlayVisible(v => !v); 
      }, 3000); 

      return () => clearInterval(intervalId);
    }
  }, [errorMessage, detectedStone]);

  // Handle confirmation button click
  const handleConfirm = () => {
    if (detectedStone) {
      navigate(`/${detectedStone}/fact`);
      // Reset state after navigation (optional)
      setShowConfirmButton(false);
    }
  };

  // Get display name for stone (capitalize first letter)
  const getStoneDisplayName = (stone: StoneType | null): string => {
    if (!stone) return '';
    return stone.charAt(0).toUpperCase() + stone.slice(1);
  };

  return (
    <div className="video-container">
      <video ref={videoRef} autoPlay playsInline muted />
      
      {/* Error message */}
      {errorMessage && (
        <div className="messages error-message default-text text--reverse">
          {errorMessage}
        </div>
      )}

      {/* Loading indicator for model */}
      {!errorMessage && !isModelLoaded && (
        <div className="messages loading-message default-text text--reverse">
          Model wordt geladen...
        </div>
      )}

      {/* Overlay (only show when no stone detected) */}
      {!errorMessage && isModelLoaded && !detectedStone && (
        <div className={`video-overlay ${isOverlayVisible ? 'visible' : 'hidden'}`}>
          <IconCamera/>
          <p className='default-text text--reverse'>Leg een steen onder de camera</p>
        </div>
      )}

      {/* Confirmation button */}
      {showConfirmButton && detectedStone && (
        <div className="confirm-button-container">
          <button 
            className="confirm-button default-text"
            onClick={handleConfirm}
          >
            Bevestig: {getStoneDisplayName(detectedStone)}
          </button>
          {/* Optional: Show confidence */}
          {/* <p className="confidence-text">Zekerheid: {Math.round(confidence * 100)}%</p> */}
        </div>
      )}
    </div>
  );
};

export default WebcamViewer;
```

**Key Changes Explained:**
1. Added `useNavigate` hook for navigation
2. Added `useStoneRecognition` hook integration
3. Added `showConfirmButton` state
4. Updated overlay logic to hide when stone detected
5. Added confirmation button with navigation handler
6. Added model loading indicator
7. Combined model errors with webcam errors

---

## Template 3: Updated CSS Styles

**File Location:** `src/Components/WebCamViewer/WebCamViewer.css`

Add these styles to your existing CSS file:

```css
/* Existing styles remain the same... */

/* Loading message */
.loading-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

/* Confirmation button container */
.confirm-button-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* Confirmation button */
.confirm-button {
  background-color: var(--color-primary, #4CAF50); /* Adjust to your theme */
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: var(--size-radius-base, 10px);
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  min-width: 200px;
}

.confirm-button:hover {
  background-color: var(--color-primary-dark, #45a049);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.confirm-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Optional: Confidence text */
.confidence-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

/* Update overlay to hide when stone detected */
.video-overlay {
  /* ... existing styles ... */
  pointer-events: none; /* Allow clicks to pass through when hidden */
}

.video-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}
```

**CSS Variables:**
- Adjust `--color-primary` to match your app's primary color
- Adjust `--size-radius-base` to match your border radius
- You can customize colors, sizes, and animations as needed

---

## Template 4: Alternative - Using Teachable Machine's Official Library

If you prefer to use the official Teachable Machine library instead of raw TensorFlow.js:

**First, install:**
```bash
npm install @teachablemachine/image
```

**Then use this simplified hook:**

```typescript
import { useEffect, useRef, useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import { StoneType } from '../data/stones';

const MODEL_URL = '/models/stone-recognition/model.json';
const METADATA_URL = '/models/stone-recognition/metadata.json';

export const useStoneRecognition = (
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean = true
) => {
  const [detectedStone, setDetectedStone] = useState<StoneType | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);
  const labelMapRef = useRef<string[]>([]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tmImage.load(MODEL_URL, METADATA_URL);
        modelRef.current = model;
        labelMapRef.current = model.getClassLabels();
        setIsModelLoaded(true);
      } catch (error: any) {
        console.error('Error loading model:', error);
      }
    };

    loadModel();
  }, []);

  useEffect(() => {
    if (!enabled || !isModelLoaded || !modelRef.current || !videoRef.current) {
      return;
    }

    let animationFrameId: number;

    const predict = async () => {
      const video = videoRef.current;
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameId = requestAnimationFrame(predict);
        return;
      }

      const model = modelRef.current;
      if (!model) return;

      const prediction = await model.predict(video);
      const topPrediction = prediction[0];

      if (topPrediction.probability >= 0.7) {
        const stoneName = topPrediction.className as StoneType;
        setDetectedStone(stoneName);
        setConfidence(topPrediction.probability);
      } else {
        setDetectedStone(null);
        setConfidence(0);
      }

      animationFrameId = requestAnimationFrame(predict);
    };

    animationFrameId = requestAnimationFrame(predict);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, isModelLoaded, videoRef]);

  return { detectedStone, confidence, isModelLoaded };
};
```

**Advantages of this approach:**
- Simpler API
- Handles metadata automatically
- Less code to write

**Disadvantages:**
- Less control over prediction process
- Additional dependency

---

## Important Implementation Notes

### 1. Model Class Order
Your Teachable Machine model classes must be in the same order as your stone names array. Check your `metadata.json` file to see the class order.

### 2. Input Size
Most Teachable Machine image models use 224x224 pixels. Adjust the resize dimensions in the hook if your model uses a different size.

### 3. Performance Tuning
- Increase `PREDICTION_INTERVAL` (e.g., 500ms) for slower devices
- Increase `STABILITY_COUNT` for more stable detection
- Increase `CONFIDENCE_THRESHOLD` to reduce false positives

### 4. Memory Management
The code includes tensor disposal to prevent memory leaks. This is important for long-running sessions.

### 5. Error Handling
Always handle errors gracefully and show user-friendly messages in Dutch (as per your existing code style).

---

## Testing Checklist

After implementing, test:

- [ ] Model loads without errors
- [ ] Webcam starts correctly
- [ ] Predictions run (check console for errors)
- [ ] Each stone type is detected correctly
- [ ] Button appears when stone detected
- [ ] Button navigates to correct fact page
- [ ] No memory leaks (check DevTools Performance)
- [ ] Works on different browsers
- [ ] Works with different cameras
- [ ] Handles errors gracefully (no camera, model not found, etc.)

---

Good luck with your implementation! 🚀

