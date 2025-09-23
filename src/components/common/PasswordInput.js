import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PasswordSetupForm from '../../features/account/components/PasswordSetupForm';
import { TransactionAPI } from '../../services/TransactionAPI';
import { AccountAPI } from '../../services/AccountAPI';

const PasswordInput = ({
  onSuccess,
  onCancel,
  title = "비밀번호를 입력해주세요",
  groupid: propGroupid,
  accountInfo,
  cardInfo,
}) => {
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { groupid, sacPk } = useParams();
  const navigate = useNavigate();

  // groupid 우선순위: props > params
  const currentGroupid = propGroupid || groupid;

  const handlePasswordChange = (field, value) => {
    if (field === 'saPw') {
      setPassword(value);
      // 에러 초기화
      if (errors.saPw) {
        setErrors(prev => ({ ...prev, saPw: '' }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!password || password.length !== 6) {
      setErrors({ saPw: '6자리 비밀번호를 입력해주세요' });
      return;
    }

    setIsLoading(true);
    try {
      let response;

      // 계좌/카드에 따라 다른 API 호출
      if (accountInfo && accountInfo.saPk) {
        // 계좌 비밀번호 검증
        response = await AccountAPI.verifyPassword(currentGroupid, accountInfo.saPk, { saPw: password });
      } else if (cardInfo && cardInfo.sacPk) {
        // 카드 비밀번호 검증
        response = await TransactionAPI.verifyPassword(currentGroupid, cardInfo.sacPk, { pw: password });
      } else {
        // 계좌/카드 정보가 없는 경우
        setErrors({ saPw: '계좌 또는 카드 정보를 찾을 수 없습니다.' });
        setIsLoading(false);
        return;
      }

      console.log(response);
      console.log(response.success);
      if (response && response.success !== false) {
        setIsLoading(false);
        onSuccess && onSuccess(password);
      } else {
        setErrors({ saPw: '비밀번호가 올바르지 않습니다' });
        setIsLoading(false);
      }

    } catch (error) {
      console.error('비밀번호 검증 실패:', error);
      const errorMessage = error.response?.data?.message || '비밀번호가 올바르지 않습니다';
      setErrors({ saPw: errorMessage });
      setIsLoading(false);
      // 에러 페이지로 리다이렉트하지 않고 에러 메시지만 표시
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white" >
      <div className="h-screen w-[375px] flex flex-col bg-gradient-to-b from-blue/70 via-light-blue via-20% to-secondary/80">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 pb-12">
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="뒤로가기"
          >
            <svg className="w-6 h-6 text-third" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* 설명 */}
        <div className="px-6 mb-4">
          <p className="text-third text-center text-xl leading-relaxed whitespace-pre-line">
            {title}
          </p>
        </div>

        {/* 비밀번호 입력 폼 */}
        <div className="flex-1 flex flex-col">
          <PasswordSetupForm
            formData={{ saPw: password }}
            updateFormData={handlePasswordChange}
            errors={errors}
            onNext={handleSubmit}
            className="bg-transparent"
          />
        </div>

        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="text-gray-700">비밀번호 확인 중...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
