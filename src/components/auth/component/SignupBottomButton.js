import React from 'react';

const SignupBottomButton = ({
  handleNext,
  buttonText,
  disabled = false,
  className = '',
}) => {
  return (
    <div className="absolute bottom-8 left-6 right-6">
      <button
        onClick={handleNext}
        disabled={disabled}
        className={`w-full h5 backdrop-blur font-bold text-third py-3 px-6 rounded-2xl text-lg shadow-[0_0_15px_rgba(0,0,0,0.15)] transition-all duration-200 ${
          disabled
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : 'bg-light-blue cursor-pointer transform hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,0,0,0.2)]'
        } ${className}`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SignupBottomButton;
