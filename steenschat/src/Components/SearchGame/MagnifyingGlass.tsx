import { useEffect, useRef } from "react";
import "./MagnifyingGlass.css";

export default function MagnifyingGlass() {
  const keysPressed = useRef({ ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false });
  const moveInterval = useRef<number | null>(null);
  const glassRef = useRef<HTMLDivElement | null>(null);
  const borderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Use the existing `.container` rendered in App.tsx
    const container = document.querySelector(".container") as HTMLElement | null;
    containerRef.current = container;

    // Create the magnifying glass element and append to body
    const glass = document.createElement("div");
    glass.className = "image";
    document.body.appendChild(glass);
    glassRef.current = glass;

    // Create a visual border (optional) and append
    const border = document.createElement("div");
    border.className = "magnifying-glass-reveal";
    document.body.appendChild(border);
    borderRef.current = border;

    // Wait for a frame so CSS variables/styles are applied, then center the glass
    requestAnimationFrame(() => {
      const g = glassRef.current;
      const b = borderRef.current;
      if (!g) return;
      const gStyle = getComputedStyle(g);
      const gWidth = parseInt(gStyle.width || "120") || 120;
      const gHeight = parseInt(gStyle.height || "120") || 120;
      g.style.left = Math.max(0, Math.round(window.innerWidth / 2 - gWidth / 2)) + "px";
      g.style.top = Math.max(0, Math.round(window.innerHeight / 2 - gHeight / 2)) + "px";
      if (b) {
        b.style.left = g.style.left;
        b.style.top = g.style.top;
      }
    });

    

    // We will update the container's clip-path directly. The amethyst image
    // is now inside the container so it will be revealed by the container's clip.

    // Move handler uses the actual glass element size so coordinates match
    const moveImage = () => {
      const g = glassRef.current;
      if (!g) return;
      let left = parseInt(g.style.left || "0") || 0;
      let top = parseInt(g.style.top || "0") || 0;
      // compute movement step dynamically based on element size for finer control
      const w = g.offsetWidth;
      const h = g.offsetHeight;
      const step = Math.max(6, Math.round(Math.max(w, h) / 10));
      if (keysPressed.current.ArrowUp) top -= step;
      if (keysPressed.current.ArrowDown) top += step;
      if (keysPressed.current.ArrowLeft) left -= step;
      if (keysPressed.current.ArrowRight) left += step;

      // clamp to container bounds (if container exists) or viewport
      // w/h already computed above when calculating step
      // const w = g.offsetWidth;
      // const h = g.offsetHeight;
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