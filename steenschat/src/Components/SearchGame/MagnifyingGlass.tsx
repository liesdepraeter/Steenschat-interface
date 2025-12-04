import { useEffect, useRef } from "react";
import "./MagnifyingGlass.css";

export default function MagnifyingGlass() {
  const keysPressed = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false });
  const moveInterval = useRef<number | null>(null);
  const glassRef = useRef<HTMLDivElement | null>(null);
  const borderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const moveBy = 15;

  useEffect(() => {
    // Use the existing `.container` rendered in App.tsx
    const container = document.querySelector(".container") as HTMLElement | null;
    containerRef.current = container;

    // Create the magnifying glass element and append to body
    const glass = document.createElement("div");
    glass.className = "image";
    // initial position (left/top) kept inline so it can be adjusted programmatically
    glass.style.left = "600px";
    glass.style.top = "400px";
    document.body.appendChild(glass);
    glassRef.current = glass;

    // Create a visual border (optional) and append
    const border = document.createElement("div");
    border.className = "magnifying-glass-reveal";
    document.body.appendChild(border);
    borderRef.current = border;

    // We will update the container's clip-path directly. The amethyst image
    // is now inside the container so it will be revealed by the container's clip.

    // Move handler uses the actual glass element size so coordinates match
    const moveImage = () => {
      const g = glassRef.current;
      if (!g) return;
      let left = parseInt(g.style.left || "0") || 0;
      let top = parseInt(g.style.top || "0") || 0;
      if (keysPressed.current.ArrowUp) top -= moveBy;
      if (keysPressed.current.ArrowDown) top += moveBy;
      if (keysPressed.current.ArrowLeft) left -= moveBy;
      if (keysPressed.current.ArrowRight) left += moveBy;

      // clamp to container bounds (if container exists) or viewport
      const w = g.offsetWidth;
      const h = g.offsetHeight;
      let minLeft = 0;
      let minTop = 0;
      let maxLeft = window.innerWidth - w;
      let maxTop = window.innerHeight - h;

      const container = containerRef.current;
      if (container) {
        const crect = container.getBoundingClientRect();
        minLeft = crect.left;
        minTop = crect.top;
        maxLeft = crect.left + crect.width - w;
        maxTop = crect.top + crect.height - h;
      }

      left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));
      top = Math.min(Math.max(top, minTop), Math.max(minTop, maxTop));

      g.style.left = left + "px";
      g.style.top = top + "px";

      // compute center based on actual element size
      const centerX = left + w / 2;
      const centerY = top + h / 2;
      const radius = Math.max(w, h) / 2;

      if (containerRef.current) {
        const clip = `circle(${radius}px at ${centerX}px ${centerY}px)`;
        containerRef.current.style.clipPath = clip;
      }

      if (borderRef.current) {
        borderRef.current.style.left = left + "px";
        borderRef.current.style.top = top + "px";
      }
    };

    const startMovement = () => {
      if (!moveInterval.current) moveInterval.current = window.setInterval(moveImage, 50);
    };
    const stopMovement = () => {
      if (moveInterval.current) {
        clearInterval(moveInterval.current);
        moveInterval.current = null;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key in keysPressed.current) {
        // @ts-ignore
        keysPressed.current[e.key] = true;
        startMovement();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key in keysPressed.current) {
        // @ts-ignore
        keysPressed.current[e.key] = false;
        const still = Object.values(keysPressed.current).some(Boolean);
        if (!still) stopMovement();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopMovement();
      // reset container clip
      if (containerRef.current) containerRef.current.style.clipPath = "circle(0px at 50% 50%)";
      if (glassRef.current) glassRef.current.remove();
      if (borderRef.current) borderRef.current.remove();
    };
  }, []);

  return null;
}

