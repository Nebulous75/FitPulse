import { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`text-center transform transition-all duration-700 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        <div className="mb-6">
          <img
            src="/image.png"
            alt="FitPulse Logo"
            className="w-32 h-32 mx-auto animate-pulse"
          />
        </div>
        <h1 className="text-6xl font-black text-white mb-2 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          Welcome To FitPulse
        </h1>
        <p className="text-3xl font-semibold text-white/95 tracking-wide">Let's get you fit!</p>
      </div>
    </div>
  );
}
