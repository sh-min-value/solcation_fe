import React, { useEffect } from 'react';
import logo from '../../assets/images/logo.svg';

const WelcomeScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-main via-main via-20% to-secondary">
      <img
        src={logo}
        alt="solcation"
        className="w-80 mb-2 animate-bounce"
        style={{
          animation: 'fadeInUp 1s ease-out'
        }}
      />
      <div
        className="text-white/80 text-lg font-bold mb-2"
        style={{
          animation: 'fadeInUp 1s ease-out 0.3s both'
        }}
      >
        여행 자금 관리, 간편하고 안전하게
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
