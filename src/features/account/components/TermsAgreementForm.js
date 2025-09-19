import React, { useState } from 'react';
import PropTypes from 'prop-types';

// 약관 동의 폼 컴포넌트
const TermsAgreementForm = ({ formData, updateFormData, errors }) => {
  // 개별 약관 동의 상태
  const [individualAgreements, setIndividualAgreements] = useState({
    serviceTerms: false,
    privacyPolicy: false,
    locationTerms: false,
  });

  // 개별 약관 동의 토글
  const handleIndividualToggle = termType => {
    const newAgreements = {
      ...individualAgreements,
      [termType]: !individualAgreements[termType],
    };
    setIndividualAgreements(newAgreements);

    // 모든 약관에 동의했는지 확인
    const allAgreed = Object.values(newAgreements).every(agreed => agreed);
    updateFormData('termsAgreed', allAgreed);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 space-y-6">
      {/* 서비스 이용약관 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg font-medium">서비스 이용약관</h3>
          <button
            type="button"
            onClick={() => handleIndividualToggle('serviceTerms')}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              individualAgreements.serviceTerms
                ? 'bg-main border-main'
                : 'border-white'
            }`}
          >
            {individualAgreements.serviceTerms && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="bg-light-blue rounded-lg p-4 max-h-32 overflow-y-auto">
          <div className="text-black text-sm leading-relaxed">
            <p className="mb-2">
              제1조 (목적) 이 약관은 솔케이션 서비스의 이용과 관련하여 회사와
              이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
            <p className="mb-2">
              제2조 (정의) 이 약관에서 사용하는 용어의 정의는 다음과 같습니다.
            </p>
            <p className="mb-2">
              1. &quot;서비스&quot;란 회사가 제공하는 솔케이션 관련 서비스를
              의미합니다.
            </p>
            <p className="mb-2">
              2. &quot;이용자&quot;란 서비스에 접속하여 이 약관에 따라 서비스를
              이용하는 회원을 의미합니다.
            </p>
            <p className="mb-2">
              제3조 (약관의 효력 및 변경) 이 약관은 이용자가 동의함으로써 효력을
              발생합니다.
            </p>
            <p className="mb-2">
              제4조 (서비스의 제공) 회사는 다음과 같은 서비스를 제공합니다.
            </p>
            <p className="mb-2">1. 계정 관리 서비스</p>
            <p className="mb-2">2. 그룹 관리 서비스</p>
            <p className="mb-2">3. 기타 회사가 정하는 서비스</p>
          </div>
        </div>
      </div>

      {/* 개인정보 처리방침 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg font-medium">개인정보 처리방침</h3>
          <button
            type="button"
            onClick={() => handleIndividualToggle('privacyPolicy')}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              individualAgreements.privacyPolicy
                ? 'bg-main border-main'
                : 'border-white'
            }`}
          >
            {individualAgreements.privacyPolicy && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="bg-light-blue rounded-lg p-4 max-h-32 overflow-y-auto">
          <div className="text-black text-sm leading-relaxed">
            <p className="mb-2">
              제1조 (개인정보의 처리목적) 회사는 다음의 목적을 위하여 개인정보를
              처리합니다.
            </p>
            <p className="mb-2">1. 서비스 제공을 위한 회원 식별 및 인증</p>
            <p className="mb-2">2. 계정 관리 및 서비스 이용 기록 관리</p>
            <p className="mb-2">3. 고객 상담 및 불만 처리</p>
            <p className="mb-2">
              제2조 (처리하는 개인정보의 항목) 회사는 다음의 개인정보 항목을
              처리하고 있습니다.
            </p>
            <p className="mb-2">
              1. 필수항목: 이름, 전화번호, 주민등록번호, 주소
            </p>
            <p className="mb-2">2. 선택항목: 이메일 주소</p>
            <p className="mb-2">
              제3조 (개인정보의 보유 및 이용기간) 회사는 개인정보 보유기간의
              경과, 처리목적의 달성 등 개인정보가 불필요하게 되었을 때에는
              지체없이 해당 개인정보를 파기합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 위치정보 이용약관 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-white text-lg font-medium">위치정보 이용약관</h3>
          <button
            type="button"
            onClick={() => handleIndividualToggle('locationTerms')}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              individualAgreements.locationTerms
                ? 'bg-main border-main'
                : 'border-white'
            }`}
          >
            {individualAgreements.locationTerms && (
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="bg-light-blue rounded-lg p-4 max-h-32 overflow-y-auto">
          <div className="text-black text-sm leading-relaxed">
            <p className="mb-2">
              제1조 (목적) 이 약관은 회사가 제공하는 위치기반 서비스의 이용과
              관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을
              목적으로 합니다.
            </p>
            <p className="mb-2">
              제2조 (위치정보의 수집 및 이용) 회사는 위치정보를 다음과 같이 수집
              및 이용합니다.
            </p>
            <p className="mb-2">1. 서비스 제공을 위한 위치 확인</p>
            <p className="mb-2">2. 이용자의 안전을 위한 응급상황 대응</p>
            <p className="mb-2">3. 서비스 개선 및 맞춤형 서비스 제공</p>
            <p className="mb-2">
              제3조 (위치정보의 보유 및 이용기간) 회사는 위치정보를 수집한 후
              1년간 보유 및 이용합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {errors.termsAgreed && (
        <div className="text-center" style={{ marginTop: '12px' }}>
          <span className="text-group-1 text-sm">{errors.termsAgreed}</span>
        </div>
      )}
    </div>
  );
};

TermsAgreementForm.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

export default TermsAgreementForm;
