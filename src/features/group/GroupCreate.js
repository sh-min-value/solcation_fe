import React, { useEffect, useRef } from 'react';
import Header from '../../components/common/Header';
import { useState } from 'react';
import BottomButton from '../../components/common/BottomButton';
import { EmojiProvider, Emoji } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';
import {
  getGroupCategoryEmojiName,
  getGroupCategoryName,
} from '../../utils/CategoryIcons';
import { ChevronDown, Plus } from 'lucide-react';
import people from '../../assets/images/people.svg';
import HappySol from '../../assets/images/happy_sol.svg';
import { GroupAPI } from '../../services/GroupAPI';
import { useNavigate } from 'react-router-dom';

const formDataKeys = ['gcPk', 'groupName', 'profileImg'];
const descriptions = [
  {
    title: '모임의 목적을\n선택해주세요.',
    type: 'select',
    props: { options: ['FRIENDS', 'COUPLE', 'FAMILY', 'COLLEAGUE'] },
  },
  {
    title: '그룹 이름을\n작성해주세요.',
    type: 'input',
    props: {},
  },
  {
    title: '그룹 프로필을\n설정해주세요.',
    type: 'profile',
    props: {},
  },
  {
    title: '그룹 생성이 완료되었어요!',
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
//1. 모임 목적 선택
const SelectPurpose = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = value || options[0];

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
          className="bg-white rounded-2xl p-3 shadow-sm cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label="그룹 카테고리 선택"
        >
          <div className="flex ml-3 items-center gap-3">
            <EmojiProvider data={emojiData}>
              <Emoji
                name={getGroupCategoryEmojiName(selectedValue)}
                size={7}
                className="w-7 h-7"
              />
            </EmojiProvider>
            <div className="text-lg">{getGroupCategoryName(selectedValue)}</div>
          </div>
          <ChevronDown
            size={20}
            className={`transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
        {isOpen && (
          <div
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-10 overflow-hidden"
          >
            {options.map((option, index) => (
              <div
                key={index}
                role="option"
                tabIndex={0}
                className="p-3 ml-3 cursor-pointer hover:bg-gray-50 flex items-center gap-3 transition-colors focus:outline-none focus:bg-blue-50"
                onClick={() => handleSelect(option)}
                onKeyDown={e => handleOptionKeyDown(e, option)}
                aria-selected={selectedValue === option}
              >
                <EmojiProvider data={emojiData}>
                  <Emoji
                    name={getGroupCategoryEmojiName(option)}
                    size={7}
                    className="w-7 h-7"
                  />
                </EmojiProvider>
                <span className="text-lg">{getGroupCategoryName(option)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

//2. 그룹 이름 작성
const InputGroupName = ({ value, onChange }) => {
  return (
    <div className="w-full flex flex-col items-right justify-center">
      <div className="w-full bg-white rounded-2xl p-4 shadow-sm">
        <input
          type="text"
          placeholder="ex) 우정만땅!"
          className="w-full text-lg border-none outline-none bg-transparent"
          maxLength={20}
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div className="text-right text-white text-sm mt-2 mr-4">
        글자수 {Math.min(value.length, 20)}/20
      </div>
    </div>
  );
};

//3. 그룹 프로필 설정
const SelectGroupImg = ({ value, onChange }) => {
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
          <div className="w-36 h-36 bg-light-blue rounded-2xl flex items-center justify-center">
            <div className="w-36 h-36 flex items-center justify-center">
              {value && value instanceof File ? (
                <img
                  src={URL.createObjectURL(value)}
                  alt="selected"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <img src={people} alt="people" className="w-24 h-24" />
              )}
            </div>
          </div>
          <button
            onClick={handleImageSelect}
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-third rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
          >
            <Plus size={16} className="w-6 h-6 text-white" />
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

//4. 완성
const CompletionStep = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 px-8">
      <div className="flex justify-center">
        <img src={HappySol} alt="happy" className="w-64 h-64 object-contain" />
      </div>
      <div className="text-white text-2xl font-semibold text-center leading-tight">
        그룹 생성이 완료되었어요!
      </div>
    </div>
  );
};

const GroupCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    gcPk: 'FRIENDS',
    groupName: '',
    profileImg: null,
  });

  //초기 설정
  const currentStepData = descriptions[currentStep];
  const isLastStep = currentStep === descriptions.length - 1;

  //다음 단계 버튼 함수
  const handleNext = async () => {
    if (currentStep === 1) {
      const groupName = formData.groupName?.trim();
      if (!groupName || groupName.length === 0) {
        alert('그룹 이름을 입력해주세요');
        return;
      }
    } else if (currentStep === 2) {
      const profileImg = formData.profileImg;
      if (!profileImg || profileImg == null) {
        alert('프로필 사진을 선택해주세요.');
        return;
      } else {
        try {
          await GroupAPI.createGroup(formData);
        } catch {
          alert('그룹 생성 중 오류가 발생했어요. 다시 시도해주세요.');
          navigate('/group');
        }
      }
    } else if (currentStep === 3) {
      navigate('/group');
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

  useEffect(() => {
    console.log(formData);
  }, [formData]);
  //전체 컴포넌트
  const stepComponents = {
    select: SelectPurpose,
    input: InputGroupName,
    profile: SelectGroupImg,
    completion: CompletionStep,
  };

  //현재 컴포넌트
  const StepComponent = stepComponents[currentStepData.type];

  const getStepProps = () => {
    if (currentStepData.type === 'completion') {
      return {};
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
        buttonText={`${isLastStep ? '그룹 홈으로 돌아가기' : '다음 단계로'}`}
      />
    </div>
  );
};

export default GroupCreate;
