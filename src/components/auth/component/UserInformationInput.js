import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import InputForm from './InputForm';

const UserInformationInput = ({ updateFormDataFunc, updateValidation }) => {
  const [tel, setTel] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('M');
  const [email, setEmail] = useState('');

  /* 전화번호 유효성 검사 상태 */
  const [telError, setTelError] = useState('');

  /* 생일 유효성 검사 상태 */
  const [dateError, setDateError] = useState('');

  /* 이메일 유효성 검사 상태 */
  const [emailError, setEmailError] = useState('');

  // 전화번호 포맷팅 시 무한 루프 방지를 위한 ref
  const isFormattingTel = useRef(false);

  // 전체 유효성 검사 및 부모 컴포넌트로 상태 전달
  useEffect(() => {
    const hasError = !!(telError || dateError || emailError);
    const isComplete = !!(tel && dateOfBirth && email && gender);

    // 부모 컴포넌트에 유효성 검사 상태 전달
    updateValidation?.({
      hasError,
      isComplete,
    });

    // 폼 데이터 업데이트 (전화번호는 숫자만 전송)
    updateFormDataFunc?.('tel', tel.replace(/-/g, ''));
    updateFormDataFunc?.('dateOfBirth', dateOfBirth);
    updateFormDataFunc?.('gender', gender);
    updateFormDataFunc?.('email', email);
  }, [
    tel,
    dateOfBirth,
    gender,
    email,
    telError,
    dateError,
    emailError,
    // updateValidation, updateFormDataFunc 제거
  ]);

  // 전화번호 포맷팅 함수 분리
  const formatPhoneNumber = value => {
    const numbers = value.replace(/[^0-9]/g, '');

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  // 전화번호 변경 핸들러
  const handleTelChange = value => {
    if (isFormattingTel.current) return; // 포맷팅 중이면 무시

    isFormattingTel.current = true;

    // 포맷팅 적용
    const formatted = formatPhoneNumber(value);
    setTel(formatted);

    // 유효성 검사
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (formatted && !phoneRegex.test(formatted)) {
      setTelError('올바른 전화번호 형식이 아닙니다.');
    } else {
      setTelError('');
    }

    // 다음 렌더 사이클에서 플래그 해제
    setTimeout(() => {
      isFormattingTel.current = false;
    }, 0);
  };

  // 생일 유효성 검사
  useEffect(() => {
    if (dateOfBirth) {
      const today = new Date();
      const selectedDate = new Date(dateOfBirth);

      if (selectedDate >= today) {
        setDateError('오늘 이전 날짜를 선택해주세요.');
      } else {
        setDateError('');
      }
    } else {
      setDateError('');
    }
  }, [dateOfBirth]);

  // 이메일 유효성 검사
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('올바른 이메일 형식이 아닙니다.');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  }, [email]);

  // 오늘 날짜를 YYYY-MM-DD 형식으로 반환
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 성별 버튼 클릭 핸들러
  const handleGenderSelect = selectedGender => {
    setGender(selectedGender);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 전화번호 */}
      <InputForm
        value={tel}
        onChange={handleTelChange}
        placeholder={'010-1234-5678'}
        maxLength={13}
        title={'전화번호'}
        error={telError}
      />

      {/* 생년월일 */}
      <div className="w-full flex flex-col">
        <div className="mb-1 font-md text-md text-white ml-1">생년월일</div>
        <div className="w-full bg-white rounded-2xl p-4 py-2 shadow-sm">
          <input
            type="date"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
            max={getTodayString()}
            className="w-full text-lg border-none outline-none bg-transparent"
          />
        </div>
        <div className="flex flex-row items-center justify-between mx-2 mt-1">
          <div className="flex-1">
            {dateError && (
              <p className="text-red-500 text-xs mt-1">{dateError}</p>
            )}
          </div>
        </div>
      </div>

      {/* 성별 */}
      <div className="w-full flex flex-col">
        <div className="mb-1 font-md text-md text-white ml-1">성별</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleGenderSelect('M')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all duration-200 ${
              gender === 'M'
                ? 'bg-third text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            남자
          </button>
          <button
            type="button"
            onClick={() => handleGenderSelect('F')}
            className={`flex-1 py-3 rounded-2xl font-medium transition-all duration-200 ${
              gender === 'F'
                ? 'bg-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            여자
          </button>
        </div>
      </div>

      {/* 이메일 */}
      <InputForm
        value={email}
        onChange={setEmail}
        placeholder={'example@email.com'}
        maxLength={50}
        title={'이메일'}
        type={'email'}
        error={emailError}
      />
    </div>
  );
};

export default UserInformationInput;
