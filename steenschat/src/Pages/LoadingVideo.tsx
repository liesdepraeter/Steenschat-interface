import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoadingVideo() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Variant ophalen dat Home heeft meegegeven via navigate state
  const location = useLocation();
  const variant = location.state?.variant || "rozenkwarts";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      navigate(`/fact/${variant}`);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [navigate, variant]);

  return (
    <div className="video-page">
      <video
        ref={videoRef}
        src="/video/Stonefiche.mp4"
        autoPlay
        muted
        playsInline
        className="loading-video"
      />
    </div>
  );
}
