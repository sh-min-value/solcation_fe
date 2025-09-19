import React, { useState } from 'react';
import PropTypes from 'prop-types';

// 비밀번호 설정
const PasswordSetupForm = ({ formData, updateFormData, errors }) => {
  const [password, setPassword] = useState('');

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
    <div className="w-full max-w-sm mx-auto px-4 space-y-20 mt-32">
      {/* 비밀번호 점 표시 */}
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
            <span className="text-group-1 text-xs">{errors.saPw}</span>
          </div>
        )}
      </div>

      {/* 숫자 패드 */}
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {/* 첫 번째 줄 */}
        <button
          type="button"
          onClick={() => handleNumberClick('1')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleNumberClick('2')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleNumberClick('3')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          3
        </button>

        {/* 두 번째 줄 */}
        <button
          type="button"
          onClick={() => handleNumberClick('4')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handleNumberClick('5')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          5
        </button>
        <button
          type="button"
          onClick={() => handleNumberClick('6')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          6
        </button>

        {/* 세 번째 줄 */}
        <button
          type="button"
          onClick={() => handleNumberClick('7')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          7
        </button>
        <button
          type="button"
          onClick={() => handleNumberClick('8')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          8
        </button>
        <button
          type="button"
          onClick={() => handleNumberClick('9')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          9
        </button>

        {/* 네 번째 줄 */}
        <div></div>
        <button
          type="button"
          onClick={() => handleNumberClick('0')}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-black text-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          ←
        </button>
      </div>
    </div>
  );
};

PasswordSetupForm.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default PasswordSetupForm;
