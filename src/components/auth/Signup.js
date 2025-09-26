import React, { useState, useCallback, useEffect } from 'react';
import Header from '../common/Header';
import { useNavigate, useParams } from 'react-router-dom';
import IdAndPasswordInput from './component/IdAndPasswordInput';
import UserInformationInput from './component/UserInformationInput';
import AddressInput from './component/AddressInput';
import SignupCompletion from './component/SignupCompletion';
import SignupBottomButton from './component/SignupBottomButton';
import SignupAPI from '../../services/SignupAPI';
import Loading from '../common/Loading';

// 단계별 설명 데이터
const descriptions = [
  {
    title: '기본 정보를 입력해주세요.',
    type: 'IdAndPasswordInput',
  },
  {
    title: '기본 정보를 입력해주세요.',
    type: 'UserInformationInput',
  },
  {
    title: '주소를 입력해주세요.',
    type: 'AddressInput',
  },
  {
    title: '회원가입이 완료되었어요!',
    type: 'SignupCompletion',
  },
];

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* 입력 정보 */
  const [formData, setFormData] = useState({
    userId: '',
    userPw: '',
    postalCode: '',
    streetAddr: '',
    addrDetail: '',
    tel: '',
    userName: '',
    dateOfBirth: '',
    gender: 'M',
    email: '',
  });

  /* 단계 처리 */
  const [currentStep, setCurrentStep] = useState(0);

  // 각 단계 별 에러 및 유효성 상태
  const [stepValidation, setStepValidation] = useState({
    0: { hasError: true, isComplete: false }, // IdAndPasswordInput
    1: { hasError: true, isComplete: false }, // UserInformationInput
    2: { hasError: true, isComplete: false }, // AddressInput
  });

  // 현재 단계의 버튼 활성화 여부 계산
  const isButtonDisabled =
    currentStep === descriptions.length - 1
      ? false
      : stepValidation[currentStep]?.hasError ||
        !stepValidation[currentStep]?.isComplete;

  // 다음 단계 처리 함수
  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      //회원가입 처리
      try {
        setLoading(true);
        await SignupAPI.signUp(formData);
      } catch (error) {
        if (error?.error.code === 40906) {
          alert(error?.error.message);
          navigate('/login');
          return;
        }
        alert('회원가입 도중 에러가 발생했습니다.');

        //에러 발생 시 에러 페이지로 이동
        navigate('/error', {
          state: {
            error: error,
            from: location.pathname,
          },
        });
      } finally {
        setLoading(false);
      }
      setCurrentStep(3);
    } else {
      console.log('final', formData);
      navigate('/login');
    }
  };

  // 폼 데이터 업데이트 함수
  const updateFormData = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  // 각 단계별 유효성 검사 상태 업데이트 함수
  const updateStepValidation = useCallback((step, validation) => {
    setStepValidation(prev => ({
      ...prev,
      [step]: validation,
    }));
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100% flex flex-col">
      <Header showBackButton={true} />

      {/* Progress Bar */}
      {currentStep !== descriptions.length - 1 && (
        <div className="flex justify-center mt-8 mb-12 ">
          <div className="flex space-x-2">
            {descriptions.slice(0, -1).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto mb-24">
        {currentStep !== descriptions.length - 1 ? (
          <div className="flex items-start justify-between px-9 mb-8">
            <div className="text-white text-xl font-[600] leading-tight whitespace-pre-line">
              {descriptions[currentStep].title}
            </div>

            <div className="text-white text-sm font-medium">
              {currentStep + 1} / {descriptions.length - 1}
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* 폼 컴포넌트 */}
        <div className="flex justify-center items-start py-9 px-9">
          {currentStep === 0 ? (
            <IdAndPasswordInput
              updateFormDataFunc={updateFormData}
              updateValidation={validation =>
                updateStepValidation(0, validation)
              }
            />
          ) : currentStep === 1 ? (
            <UserInformationInput
              updateFormDataFunc={updateFormData}
              updateValidation={validation =>
                updateStepValidation(1, validation)
              }
            />
          ) : currentStep === 2 ? (
            loading ? (
              <Loading />
            ) : (
              <AddressInput
                updateFormDataFunc={updateFormData}
                updateValidation={validation =>
                  updateStepValidation(2, validation)
                }
              />
            )
          ) : (
            <SignupCompletion />
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      {!loading && (
        <SignupBottomButton
          handleNext={handleNext}
          buttonText={
            currentStep === descriptions.length - 1 ? '완료' : '다음 단계로'
          }
          disabled={isButtonDisabled}
        />
      )}
    </div>
  );
};

export default Signup;
