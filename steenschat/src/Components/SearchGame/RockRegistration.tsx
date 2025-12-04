import { useEffect, useRef } from "react";


export default function RockRegistration() {
  const foundRef = useRef(false);

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
        // Navigate to the found page (use hash so no router required)
        window.location.hash = "#found";
      }
    }, 80);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}
