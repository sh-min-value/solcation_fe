import React, { useEffect, useState } from 'react';
import InputForm from './InputForm';
import SignupAPI from '../../../services/SignupAPI';
import { Eye, EyeOff } from 'lucide-react';
const IdAndPasswordInput = ({ updateFormDataFunc, updateValidation }) => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [userPwCheck, setUserPwCheck] = useState('');
  const [userName, setUserName] = useState('');

  /* 비밀번호 표시/숨김 상태 */
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  /* 아이디 중복 체크 관련 상태 */
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [idError, setIdError] = useState('');

  /* 비밀번호 유효성 검사 상태 */
  const [pwError, setPwError] = useState('');
  const [pwCheckError, setPwCheckError] = useState('');

  /* 이름 유효성 검사 상태 */
  const [nameError, setNameError] = useState('');

  // 전체 유효성 검사 및 부모 컴포넌트로 상태 전달
  useEffect(() => {
    const hasError = !!(idError || pwError || pwCheckError || nameError);
    const isComplete = !!(
      userId &&
      userPw &&
      userPwCheck &&
      userName &&
      isIdChecked &&
      !pwCheckError && // pwCheckError가 없어야 완료
      !pwError &&
      !nameError &&
      !idError
    );

    // 부모 컴포넌트에 유효성 검사 상태 전달
    updateValidation?.({
      hasError,
      isComplete,
    });

    // 폼 데이터 업데이트
    updateFormDataFunc?.('userId', userId);
    updateFormDataFunc?.('userPw', userPw);
    updateFormDataFunc?.('userName', userName);
  }, [
    userId,
    userPw,
    userPwCheck,
    userName,
    isIdChecked,
    idError,
    pwError,
    pwCheckError,
    nameError,
  ]);

  //아이디 변경 시 중복 체크 상태 초기화
  useEffect(() => {
    if (userId) {
      setIsIdChecked(false);
      setIdError('');
    }
  }, [userId]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    if (userPw) {
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(userPw);
      const hasEnglish = /[a-zA-Z]/.test(userPw);
      const isLengthValid = userPw.length >= 8;

      if (!isLengthValid) {
        setPwError('비밀번호는 8자 이상이어야 합니다.');
      } else if (!hasSpecialChar) {
        setPwError('특수문자를 1개 이상 포함해야 합니다.');
      } else if (!hasEnglish) {
        setPwError('영어를 1개 이상 포함해야 합니다.');
      } else {
        setPwError('');
      }
    } else {
      setPwError('');
    }
  }, [userPw]);

  //비밀번호 확인 유효성 검사
  useEffect(() => {
    if (userPwCheck) {
      if (userPw !== userPwCheck) {
        setPwCheckError('비밀번호가 일치하지 않습니다.');
      } else {
        setPwCheckError('');
      }
    } else {
      setPwCheckError('');
    }
  }, [userPwCheck, userPw]); // userPw 의존성 추가

  // 이름 유효성 검사
  useEffect(() => {
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(userName);
    if (userName) {
      if (userName.length < 1) {
        setNameError('유저 이름은 최소 1자 이상이어야 합니다.');
      } else if (hasSpecialChar) {
        setNameError('특수문자는 사용할 수 없습니다.');
      } else {
        setNameError('');
      }
    } else {
      setNameError('');
    }
  }, [userName]);

  //아이디 중복 체크 함수
  const handleIdCheck = async () => {
    if (!userId.trim()) {
      setIdError('아이디를 입력해주세요.');
      return;
    }

    if (userId.length < 4) {
      setIdError('아이디는 4자 이상이어야 합니다.');
      return;
    }

    if (userId.length > 10) {
      setIdError('아이디는 10자 이하여야 합니다.');
      return;
    }

    setIdCheckLoading(true);
    setIdError('');

    try {
      //api호출
      const isDup = await SignupAPI.checkDup(userId);

      if (!isDup) {
        setIdError('이미 사용 중인 아이디입니다.');
        setIsIdChecked(false);
      } else {
        setIdError('');
        setIsIdChecked(true);
      }
    } catch (error) {
      setIdError('중복 체크 중 오류가 발생했습니다.');
      setIsIdChecked(false);
    } finally {
      setIdCheckLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 아이디 */}
      <div className="w-full flex flex-col items-right justify-center">
        <div className="mb-1 font-md text-md text-white ml-1">아이디</div>
        <div className="w-full bg-white rounded-2xl p-4 py-2 pr-2 shadow-sm flex flex-row items-center">
          <input
            type="text"
            placeholder=""
            className="w-full text-lg border-none outline-none bg-transparent"
            maxLength={10}
            value={userId}
            onChange={e => setUserId(e.target.value)}
          />
          <button
            type="button"
            onClick={handleIdCheck}
            disabled={idCheckLoading || !userId.trim()}
            className={`px-3 py-1 text-sm rounded-xl transition-colors whitespace-nowrap h-8  w-24 ${
              isIdChecked
                ? 'bg-green-500 text-white'
                : 'bg-third hover:bg-blue text-white disabled:bg-third disabled:cursor-not-allowed'
            }`}
          >
            {idCheckLoading
              ? '확인 중...'
              : isIdChecked
              ? '확인됨'
              : '중복체크'}
          </button>
        </div>

        <div className="flex flex-row items-center justify-between mx-2 mt-1">
          {/* 아이디 관련 메시지 */}
          <div className="flex-1">
            {(() => {
              if (idError) {
                return <p className="text-red-500 text-xs mt-1">{idError}</p>;
              }

              if (isIdChecked && userId && !idError) {
                return (
                  <p className="text-third text-xs mt-1">
                    사용 가능한 아이디입니다.
                  </p>
                );
              }

              if (userId && !isIdChecked) {
                return (
                  <p className="text-orange-500 text-xs mt-1">
                    중복 확인이 필요합니다.
                  </p>
                );
              }

              return <p className="text-xs mt-1">&nbsp;</p>;
            })()}
          </div>

          {/* 글자 수 카운터 */}
          <div className="text-right text-white text-sm ml-2">
            {userId.length}/10
          </div>
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="w-full flex flex-col">
        <div className="mb-1 font-md text-md text-white ml-1">비밀번호</div>
        <div className="w-full bg-white rounded-2xl p-4 py-2 pr-2 shadow-sm flex flex-row items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder=""
            className="w-full text-lg border-none outline-none bg-transparent"
            maxLength={15}
            value={userPw}
            onChange={e => setUserPw(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex flex-row items-center justify-between mx-2 mt-1">
          <div className="flex-1">
            {pwError && <p className="text-red-500 text-xs mt-1">{pwError}</p>}
          </div>
          <div className="text-right text-white text-sm ml-2">
            {userPw.length}/15
          </div>
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="w-full flex flex-col">
        <div className="mb-1 font-md text-md text-white ml-1">
          비밀번호 확인
        </div>
        <div className="w-full bg-white rounded-2xl p-4 py-2 pr-2 shadow-sm flex flex-row items-center">
          <input
            type={showPasswordCheck ? 'text' : 'password'}
            placeholder=""
            className="w-full text-lg border-none outline-none bg-transparent"
            maxLength={15}
            value={userPwCheck}
            onChange={e => setUserPwCheck(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPasswordCheck(!showPasswordCheck)}
            className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
          >
            {showPasswordCheck ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="flex flex-row items-center justify-between mx-2 mt-1">
          <div className="flex-1">
            {pwCheckError && (
              <p className="text-red-500 text-xs mt-1">{pwCheckError}</p>
            )}
            {!pwCheckError && userPwCheck && userPw === userPwCheck && (
              <p className="text-third text-xs mt-1">비밀번호가 일치합니다.</p>
            )}
          </div>
          <div className="text-right text-white text-sm ml-2">
            {userPwCheck.length}/15
          </div>
        </div>
      </div>

      {/* 이름 */}
      <InputForm
        value={userName}
        onChange={setUserName}
        placeholder={''}
        maxLength={30}
        title={'이름'}
        error={nameError}
      />
    </div>
  );
};

export default IdAndPasswordInput;
