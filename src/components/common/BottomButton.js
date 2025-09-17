import React from 'react';

const BottomButton = ({ handleNext, buttonText }) => {
  return (
    <div className="absolute bottom-8 left-6 right-6">
      <button
        onClick={handleNext}
        className="w-full h5 bg-light-blue backdrop-blur font-bold text-third py-3 px-6 rounded-2xl text-lg shadow-[0_0_15px_rgba(0,0,0,0.15)] hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default BottomButton;
