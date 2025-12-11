import { useEffect, useState, useRef } from 'react';

interface SerialConnectionProps {
  onConnected?: () => void;
  onDisconnected?: () => void;
}

const SerialConnection: React.FC<SerialConnectionProps> = ({ onConnected, onDisconnected }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [reader, setReader] = useState<any>(null);
  const bufferRef = useRef<string>('');
  const activeKeyRef = useRef<string | null>(null);
  const keyTimeoutRef = useRef<number | null>(null);
  const buttonToKeyRef = useRef<Record<string, string>>({
    red: 'ArrowUp',
    yellow: 'ArrowDown',
    blue: 'ArrowLeft',
    green: 'ArrowRight'
  });

  const releaseKey = (keyCode: string) => {
    const keyUpEvent = new KeyboardEvent('keyup', {
      key: keyCode,
      code: keyCode,
      bubbles: true,
      cancelable: true,
    });
    window.dispatchEvent(keyUpEvent);
    activeKeyRef.current = null;
  };

  const handleArduinoInput = (data: string) => {
    // Handle newline characters - process buffered data
    if (data === '' || data === '\n' || data === '\r' || data === '\r\n') {
      const line = bufferRef.current.trim().toLowerCase();
      bufferRef.current = ''; // Clear the buffer
      
      if (!line) return; // Skip empty lines
      
      // Check if this is a release event
      if (line.endsWith('_release')) {
        const buttonPart = line.replace('_release', '');
        const keyCode = buttonToKeyRef.current[buttonPart];
        
        if (keyCode && activeKeyRef.current === keyCode) {
          releaseKey(keyCode);
          if (keyTimeoutRef.current) {
            clearTimeout(keyTimeoutRef.current);
            keyTimeoutRef.current = null;
          }
        }
      } else {
        // Button press event
        const keyCode = buttonToKeyRef.current[line];
        
        if (keyCode) {
          // Release any currently active key first
          if (activeKeyRef.current && activeKeyRef.current !== keyCode) {
            releaseKey(activeKeyRef.current);
          }
          
          // Clear any existing timeout
          if (keyTimeoutRef.current !== null) {
            clearTimeout(keyTimeoutRef.current);
          }
          
          // Set new active key
          activeKeyRef.current = keyCode;
          
          // Dispatch keydown event
          const keyDownEvent = new KeyboardEvent('keydown', {
            key: keyCode,
            code: keyCode,
            bubbles: true,
            cancelable: true,
          });
          window.dispatchEvent(keyDownEvent);
          
          // Auto-release after 200ms if no release event comes
          keyTimeoutRef.current = setTimeout(() => {
            if (activeKeyRef.current === keyCode) {
              releaseKey(keyCode);
            }
          }, 200);
        }
      }
      return;
    }
    
    // Buffer regular characters
    bufferRef.current += data;
  };

  const startReading = async (selectedPort: any) => {
    try {
      const readable = selectedPort.readable;
      if (!readable) {
        setError('Port is not readable');
        return;
      }

      console.log('Starting to read from serial port...');

      // Create a text decoder stream
      const decoder = new TextDecoderStream();
      readable.pipeTo(decoder.writable).catch((err: unknown) => {
        console.error('Pipe error:', err);
        setIsConnected(false);
        setPort(null);
        onDisconnected?.();
      });

      const input = decoder.readable.getReader();
      setReader(input);

      // Read from the port
      const readLoop = async () => {
        try {
          while (true) {
            const { value, done } = await input.read();
            if (done) {
              console.log('Serial port stream ended');
              break;
            }

            if (value) {
              // Process each character in the chunk
              for (let i = 0; i < value.length; i++) {
                const char = value[i];
                handleArduinoInput(char);
              }
            }
          }
        } catch (error) {
          console.error('Error reading from serial port:', error);
        }
      };

      readLoop();
    } catch (err) {
      console.error('Error starting reader:', err);
      setError('Error starting reader');
    }
  };

  const handleConnect = async () => {
    try {
      if (!('serial' in navigator)) {
        setError('WebSerial API not available');
        return;
      }

      const selectedPort = await (navigator as any).serial.requestPort();
      
      // Check if port is already open
      if (!selectedPort.readable) {
        await selectedPort.open({ baudRate: 9600 });
      }
      
      setPort(selectedPort);
      setIsConnected(true);
      setError('');
      onConnected?.();

      // Start reading
      startReading(selectedPort);
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        console.error('Error connecting:', err);
        setError(err.message || 'Failed to connect');
      }
    }
  };

  // Try to auto-connect to previously granted ports on mount
  useEffect(() => {
    const tryAutoConnect = async () => {
      if (!('serial' in navigator)) return;

      try {
        const ports = await (navigator as any).serial.getPorts();
        if (ports.length > 0) {
          const selectedPort = ports[0]; // Use first available port
          await selectedPort.open({ baudRate: 9600 });
          
          setPort(selectedPort);
          setIsConnected(true);
          onConnected?.();
          
          startReading(selectedPort);
        }
      } catch (err) {
        console.log('Auto-connect failed, user needs to connect manually');
      }
    };

    tryAutoConnect();
  }, [onConnected]);

  const handleDisconnect = async () => {
    try {
      if (reader) {
        reader.cancel();
        setReader(null);
      }
      if (port) {
        await port.close();
        setPort(null);
        setIsConnected(false);
        onDisconnected?.();
      }
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  };

  useEffect(() => {
    return () => {
      handleDisconnect();
    };
  }, []);

  return (
    <>
      {!isConnected && (
        <div style={{ padding: '10px', fontSize: '12px', position: 'fixed', top: 0, right: 0, zIndex: 10000, backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <span style={{ color: 'red' }}>✗ Arduino Disconnected</span>
          <button
            onClick={handleConnect}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            Connect Arduino
          </button>
          {error && <div style={{ color: 'orange', marginTop: '5px' }}>{error}</div>}
        </div>
      )}
    </>
  );
};

export default SerialConnection;
