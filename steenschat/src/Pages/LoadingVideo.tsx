import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoadingVideo.css";

export default function LoadingVideo() {
  const navigate = useNavigate();

  // We halen de steen-variant op via navigation state
  const location = useLocation();
  const variant = location.state?.variant || "rozenkwarts";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/${variant}/fact`);
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, [navigate, variant]);

  return (
    <div className="full-screen-container loading-video-container">
      <img
        src="/images/stonefiche.png"
        alt="Stone fiche"
        className="loading-image"
      />
    </div>
  );
}
