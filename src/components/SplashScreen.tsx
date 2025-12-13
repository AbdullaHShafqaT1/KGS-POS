import { useEffect, useState } from "react";
import "./SplashScreen.css";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash screen for 3 seconds then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // After fade out animation completes, call onComplete
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${!isVisible ? "fade-out" : ""}`}>
      <div className="splash-content">
        <div className="splash-logo-container">
          <div className="splash-logo">
            <svg
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
              className="store-icon"
            >
              <rect x="10" y="20" width="80" height="60" fill="none" stroke="currentColor" strokeWidth="2" rx="5" />
              <line x1="30" y1="20" x2="30" y2="80" stroke="currentColor" strokeWidth="2" />
              <line x1="70" y1="20" x2="70" y2="80" stroke="currentColor" strokeWidth="2" />
              <circle cx="25" cy="35" r="3" fill="currentColor" />
              <circle cx="50" cy="35" r="3" fill="currentColor" />
              <circle cx="75" cy="35" r="3" fill="currentColor" />
              <circle cx="25" cy="55" r="3" fill="currentColor" />
              <circle cx="50" cy="55" r="3" fill="currentColor" />
              <circle cx="75" cy="55" r="3" fill="currentColor" />
            </svg>
          </div>
        </div>

        <h1 className="splash-title">Karachi Garments Store</h1>
        <p className="splash-subtitle">POS System</p>

        <div className="splash-loader">
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
          <div className="loader-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
