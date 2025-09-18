import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { EmojiProvider, Emoji } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';
import { ChevronDown, Plus } from 'lucide-react';

import Header from '../../components/common/Header';
import BottomButton from '../../components/common/BottomButton';
import CalendarSection from '../main/components/CalendarSection';
import people from '../../assets/images/people.svg';
import HappySol from '../../assets/images/happy_sol.svg';
import { TravelAPI } from '../../services/TravelAPI';
import SelectPurpose from '../../components/common/SelectPurpose';

const Calendar = ({ selectedDates, onDateSelect }) => {
  return (
    <div className="w-full">
      <CalendarSection 
        selectedDates={selectedDates}
        onDateSelect={onDateSelect}
      />
    </div>
  );
};

const formDataKeys = ['travelTitle', 'travelDates', 'travelTheme', 'profileImg'];
const descriptions = [
  {
    title: '여행 제목을\n입력하세요',
    type: 'input',
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
    <div className="flex items-start justify-between px-9 mb-14">
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
  const selectedValue = value || travelThemes[0];

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

// 여행 테마 옵션
const travelThemes = [
  { code: 'FOOD', name: '음식 · 미식' },
  { code: 'CAFE_AND_SNACK', name: '카페 · 간식' },
  { code: 'STORE', name: '쇼핑 · 마트' },
  { code: 'PLEASURE', name: '술 · 유흥' },
  { code: 'SHOPPING', name: '쇼핑' },
  { code: 'MEDICAL_TREATMENT', name: '의료' },
  { code: 'LODGMENT', name: '숙박' },
  { code: 'TRANSPORTATION', name: '교통' },
  { code: 'TRANSFER', name: '이체' },
  { code: 'ETC', name: '기타' }
];

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

//4. 여행 프로필 사진 선택
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
  const { groupId } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [formData, setFormData] = useState({
    travelTitle: '',
    travelDates: null,
    travelTheme: travelThemes[0],
    profileImg: null,
  });

  //초기 설정
  const currentStepData = descriptions[currentStep];
  const isLastStep = currentStep === descriptions.length - 1;

  //다음 단계 버튼 함수
  const handleNext = async () => {
    if (currentStep === 0) {
      const travelTitle = formData.travelTitle?.trim();
      if (!travelTitle || travelTitle.length === 0) {
        alert('여행 제목을 입력해주세요');
        return;
      }
    } else if (currentStep === 1) {
      // 달력에서 날짜 선택 확인
      if (!selectedDates || selectedDates.length === 0) {
        alert('여행 일정을 선택해주세요.');
        return;
      }
    } else if (currentStep === 2) {
      // 테마 선택 확인 (기본값이 있으므로 항상 선택됨)
    } else if (currentStep === 3) {
      const profileImg = formData.profileImg;
      if (!profileImg || profileImg == null) {
        alert('프로필 사진을 선택해주세요.');
        return;
      } else {
        try {
          // 여기서 여행 생성 API 호출
          console.log('여행 생성 데이터:', formData);
          // await TravelAPI.createTravel(formData);
        } catch {
          alert('여행 생성 중 오류가 발생했어요. 다시 시도해주세요.');
          navigate(`/group/${groupId}/travel`);
        }
      }
    } else if (currentStep === 4) {
      navigate(`/group/${groupId}/travel`);
    }

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

  //날짜 선택 핸들러
  const handleDateSelect = (date) => {
    setSelectedDates(prev => {
      const isAlreadySelected = prev.some(selectedDate => 
        selectedDate.toDateString() === date.toDateString()
      );
      
      if (isAlreadySelected) {
        // 이미 선택된 날짜면 제거
        return prev.filter(selectedDate => 
          selectedDate.toDateString() !== date.toDateString()
        );
      } else {
        // 새로운 날짜 추가
        const newDates = [...prev, date].sort((a, b) => a - b);
        setFormData(prev => ({ ...prev, travelDates: newDates }));
        return newDates;
      }
    });
  };

  //버튼 텍스트 함수
  const getButtonText = (step) => {
    const buttonTexts = [
      '제목 입력 완료',
      '일정 선택 완료', 
      '테마 선택 완료',
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
    calendar: Calendar,
    select: SelectTravelTheme,
    profile: SelectTravelProfile,
    completion: CompletionStep,
  };

  //현재 컴포넌트
  const StepComponent = stepComponents[currentStepData.type];

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

    return {
      ...currentStepData.props,
      value: formData[formDataKeys[currentStep]] || '',
      onChange: value => updateFormData(formDataKeys[currentStep], value),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100%">
      <Header showBackButton={true} />
      {/* Progress Bar */}
      {!isLastStep && (
        <div className="flex justify-center mb-14">
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
            <div className="flex justify-center items-start py-9 px-9 flex-1">
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
        buttonText={`${isLastStep ? '여행 계획으로 돌아가기' : getButtonText(currentStep)}`}
      />
    </div>
  );
};

export default TravelCreate;
