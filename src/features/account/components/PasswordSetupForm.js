import React, { useState } from 'react';
import PropTypes from 'prop-types';

// 비밀번호 설정
const PasswordSetupForm = ({ formData, updateFormData, errors, onNext }) => {
  const [password, setPassword] = useState('');

  // 랜덤 숫자 패드 생성
  const generateRandomKeypad = () => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
    const shuffled = [...numbers].sort(() => Math.random() - 0.5);
    return shuffled;
  };

  const [keypadNumbers] = useState(() => generateRandomKeypad());

  // 숫자 입력
  const handleNumberClick = number => {
    if (password.length < 6) {
      const newPassword = password + number;
      setPassword(newPassword);
      updateFormData('saPw', newPassword);
    }
  };

  // 백스페이스
  const handleBackspace = () => {
    if (password.length > 0) {
      const newPassword = password.slice(0, -1);
      setPassword(newPassword);
      updateFormData('saPw', newPassword);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-200px)] flex flex-col">
      {/* 상단 비밀번호 점 표시 */}
      <div className="bg-blue-500 flex-1 flex justify-center items-center px-6 relative">
        <div className="flex justify-center space-x-3 relative">
          {[1, 2, 3, 4, 5, 6].map(index => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-colors ${
                index <= password.length
                  ? 'bg-white border-white'
                  : 'border-white'
              }`}
            />
          ))}
          {/* 에러 메시지 표시 */}
          {errors.saPw && (
            <div
              className="absolute -top-12 left-0 right-0 text-center"
              style={{ margin: 0 }}
            >
              <span className="text-red-300 text-[10px]">{errors.saPw}</span>
            </div>
          )}
        </div>
      </div>

      {/* 하단 키패드 섹션 */}
      <div className="bg-light-blue rounded-t-3xl flex-shrink-0">
        <div className="p-12 pb-20">
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto justify-center items-center ml-3">
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[0])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[0]}
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[1])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[1]}
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[2])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[2]}
            </button>

            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[3])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[3]}
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[4])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[4]}
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[5])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[5]}
            </button>

            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[6])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[6]}
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[7])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[7]}
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[8])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[8]}
            </button>

            {/* 네 번째 줄: ←, 6, 확인 */}
            <button
              type="button"
              onClick={handleBackspace}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => handleNumberClick(keypadNumbers[9])}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {keypadNumbers[9]}
            </button>
            <button
              type="button"
              onClick={onNext}
              className="w-16 h-16 bg-transparent rounded-lg flex items-center justify-center text-third text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

PasswordSetupForm.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  onNext: PropTypes.func,
};

export default PasswordSetupForm;
