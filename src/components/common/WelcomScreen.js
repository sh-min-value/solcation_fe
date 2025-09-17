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
      <img src={logo} alt="solcation" className="w-80 mb-2" />
      <div className="text-white text-lg font-bold mb-2">
        여행 자금 관리, 간편하고 안전하게
      </div>
    </div>
  );
};

export default WelcomeScreen;
