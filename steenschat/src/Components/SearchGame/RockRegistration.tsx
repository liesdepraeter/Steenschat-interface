import { useEffect, useRef } from "react";
import "./RockRegistration.css";

const checkmarkImage = "/images/Check-mark.png";

export default function RockRegistration() {
  const foundRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);

  const correctSound = new Audio("/sounds/correct.mp3")

  useEffect(() => {
    // Poll positions and check containment. Use a short interval to match movement.
    const interval = window.setInterval(() => {
      if (foundRef.current) return;

      const glass = document.querySelector<HTMLElement>(".image");
      const rock = document.querySelector<HTMLElement>(".rock");
      if (!glass || !rock) return;

      const gRect = glass.getBoundingClientRect();
      const rRect = rock.getBoundingClientRect();

      const centerX = gRect.left + gRect.width / 2;
      const centerY = gRect.top + gRect.height / 2;
      const radius = Math.max(gRect.width, gRect.height) / 2;

      // Check that all four corners of the rock's bounding box are within the circle
      const corners: [number, number][] = [
        [rRect.left, rRect.top],
        [rRect.right, rRect.top],
        [rRect.left, rRect.bottom],
        [rRect.right, rRect.bottom],
      ];

      const fullyInside = corners.every(([x, y]) => {
        const dx = x - centerX;
        const dy = y - centerY;
        return Math.hypot(dx, dy) <= radius - 0.5; // small tolerance
      });

      if (fullyInside) {
        foundRef.current = true;
        
        // correct sound
        correctSound.currentTime = 0;
        correctSound.play();

        // create a centered wrapper and add the checkmark image inside it
        const wrapper = document.createElement("div");
        wrapper.className = "checkmark-wrapper";

        const img = document.createElement("img");
        img.className = "checkmark-img";
        img.src = checkmarkImage;
        img.alt = "found";

        wrapper.appendChild(img);
        document.body.appendChild(wrapper);
        overlayRef.current = img;

        // after 2s remove overlay and navigate
        timeoutRef.current = window.setTimeout(() => {
          if (wrapper.parentElement) wrapper.parentElement.removeChild(wrapper);
          window.location.hash = "#found";
        }, 2000) as unknown as number;
      }
    }, 80);

    return () => {
      clearInterval(interval);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (overlayRef.current) {
        overlayRef.current.remove();
        overlayRef.current = null;
      }
    };
  }, []);

  return null;
}