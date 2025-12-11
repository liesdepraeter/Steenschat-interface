import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./LoadingVideo.css";

export default function LoadingVideo() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // We halen de steen-variant op via navigation state
  const location = useLocation();
  const variant = location.state?.variant || "rozenkwarts";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      navigate(`/${variant}/fact`);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [navigate, variant]);

  return (
    <div className="full-screen-container loading-video-container">
      <video
        ref={videoRef}
        src="/video/stonefiche.mp4"
        autoPlay
        playsInline
        className="loading-video"
      />
    </div>
  );
}
