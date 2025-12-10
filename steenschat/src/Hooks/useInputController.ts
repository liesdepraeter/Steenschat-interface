import { useEffect } from "react";

export type InputDirection = "up" | "down" | "left" | "right";
export type InputCommand = InputDirection | "confirm";

interface UseInputControllerProps {
  onCommand: (cmd: InputCommand) => void;
  confirmOnAnyPress?: boolean; // default: false
}

export function useInputController({
  onCommand,
  confirmOnAnyPress = false,
}: UseInputControllerProps) {
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      let direction: InputDirection | null = null;

      switch (e.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
        default:
          return;
      }

      // stuur de direction naar de game
      onCommand(direction);

      // als confirmOnAnyPress true is → stuur ook confirm 
      if (confirmOnAnyPress) {
        onCommand("confirm");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCommand, confirmOnAnyPress]);
}