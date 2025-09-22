import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';

import { Plus } from 'lucide-react';

import Header from '../../components/common/Header';
import BottomButton from '../../components/common/BottomButton';
import CalendarSection from '../main/components/CalendarSection';
import people from '../../assets/images/people.svg';
import HappySol from '../../assets/images/happy_sol.svg';
import { TravelAPI } from '../../services/TravelAPI';
import SelectPurpose from '../../components/common/SelectPurpose';
import SelectLocation from './components/SelectLocation';

const Calendar = ({ selectedDates, onDateSelect }) => {
  return (
    <div className="w-full">
      <CalendarSection 
        selectedDates={selectedDates}
        onDateSelect={onDateSelect}
        isClickable={true}
        showNextMonth={true}
        showPrevMonth={true}
      />
    </div>
  );
};

const descriptions = [
  {
    title: '여행 제목을\n입력하세요',
    type: 'input',
    props: {},
  },
  {
    title: '여행 지역을\n선택해주세요',
    type: 'location',
    props: {},
  },
  {
    title: '여행 일정을\n등록해주세요',
    type: 'calendar',
    props: {},
  },
  {
    title: '여행 테마를\n선택해주세요',
    type: 'select',
    props: {},
  },
  {
    title: '여행 인원수를\n선택해주세요',
    type: 'participant',
    props: {},
  },
  {
    title: '여행 프로필 사진을\n선택해주세요',
    type: 'profile',
    props: {},
  },
  {
    title: '여행 계획 생성이 완료되었어요!',
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
//2. 여행 테마 선택
const SelectTravelTheme = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = value || 'FOOD';

  const handleSelect = option => {
    onChange(option);
    setIsOpen(false);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (e, option) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(option);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-sm relative">
        <div
          role="button"
          tabIndex={0}
          className="rounded-2xl shadow-sm cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="여행 테마 선택"
        >
          <SelectPurpose
            value={selectedValue}
            onChange={handleSelect}
            type='travel'
          />
        </div>
      </div>
    </div>
  );
};

//1. 여행 제목 입력
const InputTravelTitle = ({ value, onChange }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full bg-white rounded-2xl p-4 shadow-sm">
        <input
          type="text"
          placeholder="여행 제목"
          className="w-full text-lg border-none outline-none bg-transparent text-left"
          maxLength={20}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div className="text-right text-white text-sm mt-2">
        글자수 {Math.min(value.length, 20)}/20
      </div>
    </div>
  );
};

//4. 여행 인원수 선택
const SelectParticipantCount = ({ value, onChange, maxCount }) => {
  const handleDecrease = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < maxCount) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="text-white text-lg font-medium text-center">
        여행에 참여할 인원수를 선택해주세요
      </div>
      <div className="flex items-center gap-6">
        <button
          onClick={handleDecrease}
          disabled={value <= 1}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-colors ${
            value <= 1 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-white text-blue-500 hover:bg-gray-100 cursor-pointer'
          }`}
          aria-label="인원수 감소"
        >
          −
        </button>
        
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
          <span className="text-3xl font-bold text-blue-500">{value}</span>
        </div>
        
        <button
          onClick={handleIncrease}
          disabled={value >= maxCount}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-colors ${
            value >= maxCount 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-white text-blue-500 hover:bg-gray-100 cursor-pointer'
          }`}
          aria-label="인원수 증가"
        >
          +
        </button>
      </div>
      <div className="text-white text-sm text-center">
        최대 {maxCount}명까지 선택 가능
      </div>
    </div>
  );
};

//5. 여행 프로필 사진 선택
const SelectTravelProfile = ({ value, onChange }) => {
  const fileInputRef = React.useRef(null);
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowed.includes(file.type)) {
      alert('PNG, JPG, JPEG 파일만 선택 가능합니다.');
      return;
    }

    // 파일 크기 제한
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    try {
      onChange(file);
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      alert('이미지 처리에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="relative">
          <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <div className="w-36 h-36 flex items-center justify-center">
              {value && value instanceof File ? (
                <img
                  src={URL.createObjectURL(value)}
                  alt="selected"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex items-center justify-center">
                  <img src={people} alt="people" className="w-16 h-16 opacity-50" />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleImageSelect}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white bg-third hover:bg-blue hover:text-third"
          >
            <Plus size={16} className="w-6 h-6" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg"
            onChange={handleFileChange}
            className="hidden"
            multiple={false}
          />
        </div>
      </div>
      {value && value.name && (
        <div className="mt-2 text-white text-sm text-center">{value.name}</div>
      )}
    </div>
  );
};

//5. 완성
const CompletionStep = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 px-8">
      <div className="flex justify-center">
        <img src={HappySol} alt="happy" className="w-64 h-64 object-contain" />
      </div>
      <div className="text-white text-2xl font-semibold text-center leading-tight">
        여행 계획 생성이 완료되었어요!
      </div>
    </div>
  );
};

const TravelCreate = () => {
  const navigate = useNavigate();
  const { groupid } = useParams();
  const { groupData, triggerRefresh } = useOutletContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [formData, setFormData] = useState({
    travelTitle: '',
    travelDates: null,
    travelTheme: 'FOOD',
    profileImg: null,
    selectedCountry: '전체',
    selectedCity: '전체',
    participantCount: 1, // 기본값 1명
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 로딩 상태

  //초기 설정
  const currentStepData = descriptions[currentStep];
  const isLastStep = currentStep === descriptions.length - 1;

  // 그룹 데이터가 있으면 participantCount 설정
  useEffect(() => {
    if (groupData && groupData.totalMembers) {
      setFormData(prev => ({ 
        ...prev, 
        participantCount: groupData.totalMembers 
      }));
    }
  }, [groupData]);

  //다음 단계 버튼 함수
  const handleNext = async () => {
    if (currentStep === 0) {
      const travelTitle = formData.travelTitle?.trim();
      if (!travelTitle || travelTitle.length === 0) {
        alert('여행 제목을 입력해주세요');
        return;
      }
    } else if (currentStep === 1) {
      // 나라/도시 선택 확인
      if (!formData.selectedCountry || formData.selectedCountry === '전체' || 
          !formData.selectedCity || formData.selectedCity === '전체') {
        alert('여행 지역을 선택해주세요.');
        return;
      }
    } else if (currentStep === 2) {
      // 달력에서 날짜 선택 확인
      if (!selectedDates || selectedDates.length === 0) {
        alert('여행 일정을 선택해주세요.');
        return;
      }
    } else if (currentStep === 3) {
      // 테마 선택 확인 (기본값이 있으므로 항상 선택됨)
    } else if (currentStep === 5) {
      const profileImg = formData.profileImg;
      if (!profileImg || profileImg == null) {
        alert('프로필 사진을 선택해주세요.');
        return;
      } else {
        setIsSubmitting(true);
        try {
          // FormData로 변환 (MultipartFile 전송을 위해)
          const travelFormData = new FormData();
          travelFormData.append('groupPk', groupid);
          travelFormData.append('country', formData.selectedCountry);
          travelFormData.append('city', formData.selectedCity);
          travelFormData.append('title', formData.travelTitle);
          travelFormData.append('startDate', selectedDates[0]?.toISOString().split('T')[0]);
          travelFormData.append('endDate', selectedDates[selectedDates.length - 1]?.toISOString().split('T')[0]);
          console.log('travelTheme:', formData.travelTheme);
          console.log('categoryCode:', formData.travelTheme);
          travelFormData.append('categoryCode', formData.travelTheme || 'FOOD');
          travelFormData.append('photo', profileImg); 
          travelFormData.append('participant', formData.participantCount.toString());
          
          console.log('여행 생성 데이터:', {
            groupPk: groupid,
            country: formData.selectedCountry,
            city: formData.selectedCity,
            title: formData.travelTitle,
            startDate: selectedDates[0]?.toISOString().split('T')[0],
            endDate: selectedDates[selectedDates.length - 1]?.toISOString().split('T')[0],
            categoryCode: formData.travelTheme,
            participant: formData.participantCount
          });
          
          // TravelAPI를 사용해서 여행 생성
          await TravelAPI.createTravel(travelFormData, groupid);
          setCurrentStep(currentStep + 1);
          return;
        } catch (error) {
          console.error('여행 생성 실패:', error);
          alert('여행 생성 중 오류가 발생했어요. 다시 시도해주세요.');
          navigate(`/group/${groupid}/travel`);
        } finally {
          setIsSubmitting(false);
        }
      }
    } else if (currentStep === 6) {
      navigate(`/group/${groupid}/travel`);
    }

    // 프로필 사진 단계가 아닌 경우에만 다음 단계로
    if (currentStep < descriptions.length - 1 && currentStep !== 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  //이전 버튼 함수
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }else{
      navigate(`/group/${groupid}/travel`);
    }
  };

  //선택한 값 업데이트
  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  //날짜 선택 핸들러
  const handleDateSelect = (dateOrDates) => {
    // 배열인 경우 (두 번째 클릭으로 시작일과 종료일이 모두 선택됨)
    if (Array.isArray(dateOrDates)) {
      setSelectedDates(dateOrDates);
      setFormData(prev => ({ ...prev, travelDates: dateOrDates }));
    } 
    // 단일 날짜인 경우 (첫 번째 클릭)
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // 오늘 이전 날짜는 선택 불가
      if (dateOrDates < today) {
        return;
      }
      
      // 첫 번째 날짜 선택
      const newDates = [dateOrDates];
      setSelectedDates(newDates);
      setFormData(prev => ({ ...prev, travelDates: newDates }));
    }
  };


  //버튼 텍스트 함수
  const getButtonText = (step) => {
    const buttonTexts = [
      '제목 입력 완료',
      '지역 선택 완료',
      '일정 선택 완료', 
      '테마 선택 완료',
      '인원수 선택 완료',
      '여행 계획 생성하기'
    ];
    return buttonTexts[step] || '다음 단계로';
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  //전체 컴포넌트
  const stepComponents = {
    input: InputTravelTitle,
    location: SelectLocation,
    calendar: Calendar,
    select: SelectTravelTheme,
    participant: SelectParticipantCount,
    profile: SelectTravelProfile,
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

    if (currentStepData.type === 'calendar') {
      return {
        ...currentStepData.props,
        selectedDates: selectedDates,
        onDateSelect: handleDateSelect,
      };
    }

    if (currentStepData.type === 'location') {
      return {
        ...currentStepData.props,
        onChange: (locationData) => {
          updateFormData('selectedCountry', locationData.country);
          updateFormData('selectedCity', locationData.city);
        },
      };
    }

    // 각 단계별로 명시적으로 처리
    if (currentStepData.type === 'input') {
      return {
        ...currentStepData.props,
        value: formData.travelTitle || '',
        onChange: value => updateFormData('travelTitle', value),
      };
    }
    
    if (currentStepData.type === 'select') {
      return {
        ...currentStepData.props,
        value: formData.travelTheme || 'FOOD',
        onChange: value => updateFormData('travelTheme', value),
      };
    }
    
    if (currentStepData.type === 'participant') {
      return {
        ...currentStepData.props,
        value: formData.participantCount || (groupData?.totalMembers || 1),
        maxCount: groupData?.totalMembers || 1,
        onChange: value => updateFormData('participantCount', value),
      };
    }
    
    if (currentStepData.type === 'profile') {
      return {
        ...currentStepData.props,
        value: formData.profileImg || null,
        onChange: value => updateFormData('profileImg', value),
      };
    }

    return {
      ...currentStepData.props,
      value: '',
      onChange: () => {},
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100%">
      <Header showBackButton={true} onBack={handlePrev} />
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
        buttonText={`${isSubmitting ? '여행 생성 중...' : (isLastStep ? '여행 계획으로 돌아가기' : getButtonText(currentStep))}`}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default TravelCreate;
