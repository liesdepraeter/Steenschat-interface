import { useEffect, useState, useRef } from "react";

export type InputDirection = "up" | "down" | "left" | "right";
export type InputCommand = InputDirection | "confirm";

interface UseInputControllerProps {
  onCommand: (cmd: InputCommand) => void;
  confirmOnAnyPress?: boolean; 
  onReset?: () => void;        // callback voor reset
  allowWhenBlocked?: boolean;  // laat input door als globale block actief is
}

export function useInputController({
  onCommand,
  confirmOnAnyPress = false,
  onReset,
  allowWhenBlocked = false,
}: UseInputControllerProps) {

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const pressedKeysRef = useRef<Set<string>>(new Set());
  const resetTriggeredRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Globale blokker: andere listeners worden genegeerd wanneer een overlay actief is
      // tenzij deze hook expliciet is toegestaan.
      if ((window as any).__inputBlocked && !allowWhenBlocked) return;

      e.preventDefault();

      // Update both state and ref
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(e.key);
        pressedKeysRef.current = newSet;
        return newSet;
      });

      // stuur direction naar de app
      let direction: InputDirection | null = null;
      switch (e.key) {
        case "ArrowUp": direction = "up"; break;
        case "ArrowDown": direction = "down"; break;
        case "ArrowLeft": direction = "left"; break;
        case "ArrowRight": direction = "right"; break;
      }
      if (direction) onCommand(direction);

      // confirm op elke toets als flag aan staat
      if (confirmOnAnyPress) onCommand("confirm");

      // reset check: left + right tegelijk (use ref for current state)
      // Only trigger if both keys are actually pressed and reset hasn't been triggered
      if (onReset && !resetTriggeredRef.current) {
        const currentKeys = pressedKeysRef.current;
        // Check if the current key being pressed is one of the reset keys
        const isResetKey = e.key === "ArrowLeft" || e.key === "ArrowRight";
        if (isResetKey && currentKeys.has("ArrowLeft") && currentKeys.has("ArrowRight")) {
          // Both keys must be in the set (meaning both are currently pressed)
          // Use a small delay to ensure both keys are truly held simultaneously
          // This prevents accidental resets from rapid key presses
          resetTriggeredRef.current = true;
          const timeoutId = setTimeout(() => {
            // Double-check that both keys are still pressed after delay
            if (pressedKeysRef.current.has("ArrowLeft") && pressedKeysRef.current.has("ArrowRight")) {
              onReset();
            } else {
              // If keys were released before timeout, cancel reset
              resetTriggeredRef.current = false;
            }
          }, 150);
          
          // Store timeout ID to clear if needed
          (window as any).__resetTimeout = timeoutId;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        pressedKeysRef.current = newSet;
        
        // If a reset key is released, cancel any pending reset
        if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && (window as any).__resetTimeout) {
          clearTimeout((window as any).__resetTimeout);
          (window as any).__resetTimeout = null;
          resetTriggeredRef.current = false;
        }
        
        // Reset the reset trigger when all keys are released
        if (newSet.size === 0) {
          resetTriggeredRef.current = false;
        }
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onCommand, confirmOnAnyPress, onReset, allowWhenBlocked]);
}
