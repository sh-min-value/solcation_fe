import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AccountAPI } from '../../../services/AccountAPI';
import { useNavigate } from 'react-router-dom';
import happySolImage from '../../../assets/images/happy_sol.svg';

// 계좌 생성 완료 폼 컴포넌트
const AccountCompletionForm = ({ groupId }) => {
  const navigate = useNavigate();
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copyMessage, setCopyMessage] = useState('');

  // 계좌 정보 조회
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await AccountAPI.getAccountInfo(groupId);
        setAccountInfo(response.data || response);
      } catch (error) {
        console.error('계좌 정보 조회 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [groupId]);

  // 계좌번호 복사
  const handleCopyAccountNumber = () => {
    if (accountInfo?.accountNum) {
      navigator.clipboard.writeText(accountInfo.accountNum);
      setCopyMessage('복사되었습니다!');
      // 2초 후 메시지 제거
      setTimeout(() => {
        setCopyMessage('');
      }, 2000);
    }
  };

  // 계좌번호 포맷팅팅
  const formatAccountNumber = accountNum => {
    if (!accountNum) return '';
    return accountNum.replace(/(\d{4})(\d{2})(\d{6})/, '$1-$2-$3');
  };

  // 그룹 홈으로 이동
  const handleGoToGroupHome = () => {
    navigate(`/group/${groupId}`);
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto px-4 flex items-center justify-center min-h-[400px]">
        <div className="text-white text-lg">계좌 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 flex flex-col items-center justify-center min-h-[500px] space-y-8 pt-24">
      {/* 곰 이미지 */}
      <div className="flex justify-center">
        <img
          src={happySolImage}
          alt="Happy Sol"
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* 완료 메시지 */}
      <div className="text-center space-y-2">
        <h2 className="text-white text-xl font-bold">
          계좌 개설이 완료되었어요!
        </h2>
        <p className="text-light-blue text-lg">계좌 번호를 확인해주세요.</p>
      </div>

      {/* 계좌번호 입력 필드 */}
      <div className="w-full max-w-sm">
        <div className="relative">
          <input
            type="text"
            value={formatAccountNumber(accountInfo?.accountNum) || ''}
            readOnly
            className="w-full px-4 py-3 bg-white rounded-lg text-black text-lg font-medium text-left border-none outline-none"
          />
          <button
            type="button"
            onClick={handleCopyAccountNumber}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-main hover:text-main/80 transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
          </button>
        </div>
        {/* 복사 완료 메시지 */}
        {copyMessage && (
          <div className="text-black text-sm mt-2 text-center">
            {copyMessage}
          </div>
        )}
      </div>

      {/* 그룹 홈으로 돌아가기 버튼 */}
      <div className="absolute bottom-8 left-6 right-6">
        <button
          type="button"
          onClick={handleGoToGroupHome}
          className="w-full h5 bg-light-blue backdrop-blur font-bold text-third py-3 px-6 rounded-2xl text-lg shadow-[0_0_15px_rgba(0,0,0,0.15)] hover:shadow-[0_0_25px_rgba(0,0,0,0.2)] transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
        >
          그룹 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

AccountCompletionForm.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default AccountCompletionForm;
