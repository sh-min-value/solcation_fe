import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CardAPI } from '../../services/CardAPI';
import Header from '../../components/common/Header';
import BottomButton from '../../components/common/BottomButton';
import PasswordSetupForm from '../account/components/PasswordSetupForm';
import HappySol from '../../assets/images/happy_sol.svg';

const descriptions = [
  {
    title: '카드를 배송받을 주소를\n확인할게요.',
    type: 'address',
    props: {},
  },
  {
    title: '비밀번호를 설정해주세요',
    type: 'password',
    props: {},
  },
  {
    title: '카드 개설이 완료되었어요!',
    type: 'completion',
    props: {},
  },
];

//설명 컴포넌트
const Description = ({ title, currentStep }) => {
  return (
    <div className="flex items-start justify-between px-9 mb-4">
      <div className="text-white text-xl font-[600] leading-tight whitespace-pre-line">
        {title}
      </div>
      <div className="text-white text-medium font-medium">
        {currentStep + 1} / {descriptions.length - 1}
      </div>
    </div>
  );
};

/* 단계 별 컴포넌트 */
//1. 주소 확인 (유저 정보에서 가져오기)
const AddressConfirm = ({ userProfile }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <div className="w-full bg-white rounded-2xl p-6 shadow-sm">
        <div className="text-gray-600 text-sm mb-4">배송받을 주소</div>
        <div className="text-lg font-medium text-gray-800 mb-2">
          {userProfile?.address || '주소 정보가 없습니다'}
        </div>
        <div className="text-sm text-gray-500">
          {userProfile?.addressDetail || ''}
        </div>
        <div className="text-sm text-gray-500">
          {userProfile?.postCode || ''}
        </div>
      </div>
      <div className="text-white text-sm text-center">
        위 주소로 카드가 배송됩니다
      </div>
    </div>
  );
};

//2. 비밀번호 설정
const PasswordSetup = ({ value, onChange }) => {
  const [password, setPassword] = useState(value || '');
  const [errors, setErrors] = useState({});

  const updateFormData = (field, newValue) => {
    if (field === 'saPw') {
      setPassword(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <PasswordSetupForm
        formData={{ saPw: password }}
        updateFormData={updateFormData}
        errors={errors}
      />
    </div>
  );
};

//3. 완성
const CompletionStep = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 px-8">
      <div className="flex justify-center">
        <img src={HappySol} alt="happy" className="w-64 h-64 object-contain" />
      </div>
      <div className="text-white text-2xl font-semibold text-center leading-tight">
        카드 개설이 완료되었어요!
      </div>
    </div>
  );
};

const CardCreate = () => {
  const navigate = useNavigate();
  const { groupid } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [formData, setFormData] = useState({
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  //초기 설정
  const currentStepData = descriptions[currentStep];
  const isLastStep = currentStep === descriptions.length - 1;

  //유저 주소 조회 (그룹별)
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        console.log('유저 주소 조회 시작');
        const response = await CardAPI.getGroupUserAddress(groupid);
        console.log('유저 주소 응답:', response);
        setUserProfile(response);
      } catch (error) {
        console.error('유저 주소 조회 실패:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchUserAddress();
  }, [groupid]);

  //다음 단계 버튼 함수
  const handleNext = async () => {
    if (currentStep === 0) {
      if (!userProfile?.address) {
        alert('주소 정보가 없습니다. 계정 설정에서 주소를 입력해주세요.');
        return;
      }
    } else if (currentStep === 1) {
      // 비밀번호 설정 확인
      if (!formData.password || formData.password.length !== 6) {
        alert('6자리 비밀번호를 입력해주세요.');
        return;
      }
    } else if (currentStep === 2) {
      // 카드 개설 API 호출
      try {
        setIsSubmitting(true);
        console.log('카드 개설 시작:', { groupId: groupid, password: formData.password });
        const response = await CardAPI.openCard(groupid, formData.password);
        console.log('카드 개설 성공:', response);
        
        // 성공 후 그룹 홈으로 이동
        navigate(`/group/${groupid}/account`);
        return;
      } catch (error) {
        console.error('카드 개설 실패:', error);
        alert('카드 개설에 실패했습니다. 다시 시도해주세요.');
        setIsSubmitting(false);
        return;
      }
    }

    // 다음 단계로
    if (currentStep < descriptions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  //이전 버튼 함수
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  //선택한 값 업데이트
  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };



  //버튼 텍스트 함수
  const getButtonText = (step) => {
    const buttonTexts = [
      '다음 단계로',
      '다음 단계로',
      '그룹 홈으로 돌아가기'
    ];
    return buttonTexts[step] || '다음 단계로';
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  //전체 컴포넌트
  const stepComponents = {
    address: AddressConfirm,
    password: PasswordSetup,
    completion: CompletionStep,
  };

  //현재 컴포넌트
  const StepComponent = stepComponents[currentStepData.type];
  
  // 디버깅용 콘솔 출력
  console.log('현재 단계:', currentStep);
  console.log('현재 단계 데이터:', currentStepData);
  console.log('StepComponent:', StepComponent);

  const getStepProps = () => {
    if (currentStepData.type === 'completion') {
      return {};
    }

    if (currentStepData.type === 'address') {
      console.log('userProfile:', userProfile);
      return {
        ...currentStepData.props,
        userProfile: userProfile,
      };
    }
    
    if (currentStepData.type === 'password') {
      return {
        ...currentStepData.props,
        value: formData.password,
        onChange: (password) => updateFormData('password', password),
      };
    }

    return {
      ...currentStepData.props,
      value: '',
      onChange: () => {},
    };
  };

  // 로딩 중일 때
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100% flex items-center justify-center">
        <div className="text-white text-lg">사용자 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100%">
      <Header showBackButton={true} />
      {/* Progress Bar */}
      {!isLastStep && (
        <div className="flex justify-center mb-4">
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
      {/* 내용 */}
      {/* 메인 콘텐츠 영역 */}
      <div className="flex flex-col min-h-[calc(100vh-140px)]">
        {/* 완료 단계 X */}
        {!isLastStep && (
          <>
            {/* 설명 */}
            <Description
              title={descriptions[currentStep].title}
              currentStep={currentStep}
            />
            {/* 내용 */}
            <div className="flex min-h-[calc(100vh-500px)] justify-center items-start py-9 px-9 lex-1">
              <StepComponent {...getStepProps()} />
            </div>
          </>
        )}

        {/* 완료 단계 O */}
        {isLastStep && (
          <div className="flex-1 flex items-center justify-center">
            <CompletionStep />
          </div>
        )}
      </div>
      {/*하단 버튼 */}
      <BottomButton
        handleNext={handleNext}
        buttonText={`${isSubmitting ? '카드 생성 중...' : getButtonText(currentStep)}`}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default CardCreate;
