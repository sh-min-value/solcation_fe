import React from 'react';
import HappySol from '../../../assets/images/happy_sol.svg';

const SignupCompletion = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 px-3">
      <div className="flex justify-center">
        <img src={HappySol} alt="happy" className="w-64 h-64 object-contain" />
      </div>
      <div className="text-white text-2xl font-semibold text-center leading-tight">
        회원가입이 완료되었어요!
      </div>
    </div>
  );
};

export default SignupCompletion;
