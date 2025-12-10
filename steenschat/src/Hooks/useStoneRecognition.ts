import { useEffect, useRef, useState, type RefObject } from 'react';
import * as tmImage from '@teachablemachine/image';
import { allStoneTypes, type StoneType } from '../data/stones';

const MODEL_URL = '/models/stone-recognition/model.json';
const METADATA_URL = '/models/stone-recognition/metadata.json';
const NO_STONE_LABEL = 'noStone';
type ModelLabel = StoneType | typeof NO_STONE_LABEL;

interface UseStoneRecognitionResult {
  detectedStone: StoneType | null;
  confidence: number;
  isModelLoaded: boolean;
  isPredicting: boolean;
  modelError: string | null;
}

// Tuning knobs
const CONFIDENCE_THRESHOLD = 0.6; // minimum confidence to consider a detection
const STABILITY_COUNT = 3; // require N consecutive frames with same label
const PREDICTION_INTERVAL_MS = 1000; // throttle predictions

export const useStoneRecognition = (
  videoRef: RefObject<HTMLVideoElement>,
  enabled: boolean = true
): UseStoneRecognitionResult => {
  const [detectedStone, setDetectedStone] = useState<StoneType | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);
  const labelMapRef = useRef<string[]>([]);
  const rafRef = useRef<number | null>(null);
  const stabilityRef = useRef<{ label: ModelLabel | null; count: number }>({
    label: null,
    count: 0,
  });
  const stoneSetRef = useRef<Set<StoneType>>(new Set(allStoneTypes));

  // Load model once
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setModelError(null);
        const model = await tmImage.load(MODEL_URL, METADATA_URL);
        if (!isMounted) return;

        modelRef.current = model;
        labelMapRef.current = model.getClassLabels();
        setIsModelLoaded(true);
      } catch (err: any) {
        console.error('Model load error:', err);
        if (isMounted) {
          setModelError(`Model kon niet geladen worden: ${err.message ?? err}`);
          setIsModelLoaded(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Prediction loop
  useEffect(() => {
    const shouldRun =
      enabled &&
      isModelLoaded &&
      modelRef.current &&
      videoRef.current &&
      !modelError;

    if (!shouldRun) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsPredicting(false);
      return;
    }

    let lastPrediction = 0;

    const predict = async () => {
      const now = performance.now();
      if (now - lastPrediction < PREDICTION_INTERVAL_MS) {
        rafRef.current = requestAnimationFrame(predict);
        return;
      }
      lastPrediction = now;

      const video = videoRef.current;
      const model = modelRef.current;
      if (!video || !model || video.readyState < video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(predict);
        return;
      }

      try {
        const predictions = await model.predict(video, false);
        if (!predictions.length) {
          rafRef.current = requestAnimationFrame(predict);
          return;
        }

        // highest probability
        const top = predictions.reduce(
          (best, current) =>
            current.probability > best.probability ? current : best,
          predictions[0]
        );

        const label = top.className as ModelLabel;
        const prob = top.probability;

        const isNoStone = label === NO_STONE_LABEL;
        const isKnownStone =
          !isNoStone && stoneSetRef.current.has(label as StoneType);

        if (!isKnownStone || prob < CONFIDENCE_THRESHOLD) {
          stabilityRef.current = { label: null, count: 0 };
          setDetectedStone(null);
          setConfidence(0);
        } else {
          if (stabilityRef.current.label === label) {
            stabilityRef.current.count += 1;
          } else {
            stabilityRef.current = { label, count: 1 };
          }

          if (stabilityRef.current.count >= STABILITY_COUNT) {
            setDetectedStone(label as StoneType);
            setConfidence(prob);
          }
        }
      } catch (err) {
        console.error('Prediction error:', err);
      }

      rafRef.current = requestAnimationFrame(predict);
    };

    setIsPredicting(true);
    rafRef.current = requestAnimationFrame(predict);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsPredicting(false);
    };
  }, [enabled, isModelLoaded, modelError, videoRef]);

  return {
    detectedStone,
    confidence,
    isModelLoaded,
    isPredicting,
    modelError,
  };
};

