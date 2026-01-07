import { useEffect, useState } from 'react';
import './Countdown.css';

interface CountdownProps {
  start?: number;
  onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ start = 5, onComplete }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (count <= 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setCount(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (count <= 0) return null;

  return (
    <p className="countdown bold-text text--reverse">
      Klaar? {count}...
    </p>
  );
};

export default Countdown;