import React, { useState } from 'react';
import Header from '../../components/common/Header';
import BottomButton from '../../components/common/BottomButton';
import { useNavigate, useParams } from 'react-router-dom';
import { AccountAPI } from '../../services/AccountAPI';
import AccountInfoForm from './components/AccountInfoForm';
import PasswordSetupForm from './components/PasswordSetupForm';
import TermsAgreementForm from './components/TermsAgreementForm';
import AccountCompletionForm from './components/AccountCompletionForm';
import { useAuth } from '../../context/AuthContext';

// 단계별 설명 데이터
const descriptions = [
  {
    title: '계정 정보를 확인할게요.',
    type: 'accountInfo',
  },
  {
    title: '비밀번호를 설정해주세요.',
    type: 'passwordSetup',
  },
  {
    title: '약관에 동의해주세요.',
    type: 'termsAgreement',
  },
  {
    title: '계좌 개설이 완료되었어요!',
    type: 'completion',
  },
];

const AccountCreate = () => {
  const navigate = useNavigate();
  const { groupid: groupId } = useParams();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);

  // 서명 데이터를 파일로 변환하는 함수
  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const [formData, setFormData] = useState({
    residentNumber: { front: '', back: '' },
    address: '',
    signature: null,
    saPw: '',
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({
    accountName: '',
    residentNumber: '',
    address: '',
    phoneNumber: '',
    signature: '',
    saPw: '',
    termsAgreed: '',
  });

  // 다음 단계 처리 함수
  const handleNext = async () => {
    if (currentStep === 0) {
      // 입력 안했을 시 메세지 출력
      const newErrors = {
        residentNumber:
          !formData.residentNumber?.front ||
            formData.residentNumber.front.length !== 6 ||
            !formData.residentNumber?.back ||
            formData.residentNumber.back.length !== 7
            ? '주민등록번호를 입력해주세요'
            : '',
        address: !formData.address?.trim() ? '주소를 입력해주세요' : '',
        signature: !formData.signature ? '서명을 해주세요' : '',
      };

      setErrors(newErrors);

      if (Object.values(newErrors).some(error => error !== '')) {
        return;
      }

      setCurrentStep(1);
    } else if (currentStep === 1) {
      // 비밀번호 유효성 검사
      if (!formData.saPw || formData.saPw.length !== 6) {
        setErrors(prev => ({ ...prev, saPw: '6자리 비밀번호를 입력해주세요' }));
        return;
      }

      // 에러 초기화
      setErrors(prev => ({ ...prev, saPw: '' }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // 약관 동의 유효성 검사
      if (!formData.termsAgreed) {
        setErrors(prev => ({ ...prev, termsAgreed: '약관에 동의해주세요' }));
        return;
      }

      // 에러 초기화
      setErrors(prev => ({ ...prev, termsAgreed: '' }));

      // 계좌 생성 API 호출 - 필요한 값들만 전달
      try {
        // 서명 데이터를 파일로 변환
        const signatureFile = dataURLtoFile(
          formData.signature,
          'signature.png'
        );

        // API에 전달할 데이터 (groupPk, saPw, signature만 필요)
        const accountData = {
          groupPk: groupId,
          saPw: formData.saPw,
          signature: signatureFile,
        };

        await AccountAPI.createAccount(groupId, accountData);
        setCurrentStep(3);
      } catch (error) {
        console.error('계좌 생성 오류:', error);
        navigate('/error', {
          state: {
            error: error,
            from: location.pathname,
          },
        });
      }
    }
  };

  // 폼 데이터 업데이트 함수
  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100%">
      <Header showBackButton={true} />

      {/* Progress Bar */}
      {currentStep !== descriptions.length - 1 && (
        <div className="flex justify-center mt-8 mb-12">
          <div className="flex space-x-2">
            {descriptions.slice(0, -1).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index <= currentStep ? 'bg-white' : 'bg-white/30'
                  }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-col min-h-[calc(100vh-140px)] mt-8">
        {/* 단계 설명 */}
        <div className="flex items-start justify-between px-9 mb-8">
          <div className="text-white text-xl font-[600] leading-tight whitespace-pre-line">
            {descriptions[currentStep].title}
          </div>
          <div className="text-white text-sm font-medium">
            {currentStep + 1} / {descriptions.length}
          </div>
        </div>

        {/* 폼 컴포넌트 */}
        <div className="flex justify-center items-start px-0 flex-1">
          {currentStep === 0 ? (
            <AccountInfoForm
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          ) : currentStep === 1 ? (
            <PasswordSetupForm
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
              onNext={handleNext}
            />
          ) : currentStep === 2 ? (
            <TermsAgreementForm
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          ) : (
            <AccountCompletionForm groupId={groupId} />
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      {currentStep !== 1 && currentStep !== 3 && (
        <BottomButton
          handleNext={handleNext}
          buttonText={
            currentStep === descriptions.length - 2 ? '완료' : '다음 단계로'
          }
        />
      )}
    </div>
  );
};

export default AccountCreate;
