import { useEffect, useState } from "react";

export type InputDirection = "up" | "down" | "left" | "right";
export type InputCommand = InputDirection | "confirm";

interface UseInputControllerProps {
  onCommand: (cmd: InputCommand) => void;
  confirmOnAnyPress?: boolean; 
  onReset?: () => void;        // callback voor reset
}

export function useInputController({
  onCommand,
  confirmOnAnyPress = false,
  onReset,
}: UseInputControllerProps) {

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.add(e.key);
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

      // reset check: left + right tegelijk
      if (onReset && pressedKeys.has("ArrowLeft") && pressedKeys.has("ArrowRight")) {
        onReset();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(e.key);
        return newSet;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onCommand, confirmOnAnyPress, onReset, pressedKeys]);
}
