import React, { useState, useEffect } from 'react';
import { Copy, MoreVertical } from 'lucide-react';
import RegularDepositModal from './RegularDepositModal';
import { AccountAPI } from '../../services/AccountAPI';
import { GroupAPI } from '../../services/GroupAPI';
import { useAuth } from '../../context/AuthContext';

const BriefAccount = ({ accountInfo, isGroupLeader }) => {
  const [showModal, setShowModal] = useState(false);
  const [copyMessage, setCopyMessage] = useState('');

  //정기 입금일 모달
  const [isRegularModalOpen, setIsRegularModalOpen] = useState(false);

  //잔액 포맷팅
  const formatBalance = amount => {
    return amount.toLocaleString('ko-KR');
  };

  // 계좌번호 포맷팅
  const formatAccountNumber = accountNum => {
    if (!accountNum) return '';
    return accountNum.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  };

  // 계좌번호 복사 처리
  const handleCopyAccountNumber = () => {
    if (accountInfo?.accountNum) {
      navigator.clipboard.writeText(accountInfo.accountNum);
      setCopyMessage('복사되었습니다!');
      setTimeout(() => {
        setCopyMessage('');
      }, 2000);
    }
  };

  //잔액에 따른 폰트 크기 조정
  const getBalanceFontSize = amount => {
    const formatted = formatBalance(amount);
    if (formatted.length > 12) return 'text-sm';
    if (formatted.length > 9) return 'text-base';
    if (formatted.length > 6) return 'text-lg';
    return 'text-xl';
  };

  return (
    <div className="w-full bg-gradient-to-br from-third/60 to-third rounded-3xl text-white overflow-hidden">
      <RegularDepositModal
        isOpen={isRegularModalOpen}
        onClose={() => setIsRegularModalOpen(false)}
        groupId={accountInfo.groupPk}
        isGroupLeader={isGroupLeader}
        accountInfo={accountInfo}
      />
      {/* 계좌 */}
      <div className="px-4 py-4 relative">
        <MoreVertical
          role="button"
          onClick={() => setShowModal(true)}
          className="absolute top-4 right-4 w-4 h-4 text-white opacity-80"
        />
        <div className="flex flex-col items-start justify-center px-4 gap-1">
          <div className="flex flex-col items-start w-full">
            <h2 className="text-sm font-medium opacity-90">
              신한은행 모임통장
            </h2>
            <div className="flex items-center gap-2 text-base opacity-70 relative">
              <span className="tracking-tight underline text-underline-offset-1">
                {formatAccountNumber(accountInfo.accountNum)}
              </span>
              <Copy
                className="w-4 h-4 cursor-pointer"
                onClick={handleCopyAccountNumber}
              />
              {/* 복사 완료 메시지 */}
              {copyMessage && (
                <div className="absolute top-5 left-11 transform -translate-x-1/2 bg-opacity-80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {copyMessage}
                </div>
              )}
            </div>
          </div>

          <div className="text-right overflow-hidden w-full">
            <span
              className={`${getBalanceFontSize(
                accountInfo?.balance || 0
              )} font-bold break-all leading-tight text-xl`}
            >
              {formatBalance(accountInfo?.balance || 0)}원
            </span>
          </div>
        </div>
        {/* 정기 입금일 설정 모달 */}
        {showModal && (
          <>
            {/* 배경 오버레이 */}
            <div
              role="button"
              tabIndex={0}
              className="fixed inset-0 rounded-3xl cursor-default z-[51]"
              onClick={() => setShowModal(false)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === '') {
                  e.preventDefault();
                  setShowModal(false);
                }
              }}
              aria-label="close modal"
            />

            {/* 모달 */}
            <div className="absolute top-10 right-4 rounded-xl z-[60]">
              <div className="bg-white text-gray-1 rounded-xl px-1 py-1 shadow-lg min-w-48 hover:bg-gray-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setIsRegularModalOpen(true);
                  }}
                  className="w-full text-center text-base font-medium py-2 rounded-lg transition-colors"
                >
                  정기 입금일 설정
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="border-t border-white border-opacity-20">
        <div className="flex">
          <button className="flex-1 py-2 text-center text-sm font-medium bg-black bg-opacity-10 hover:bg-opacity-20 transition-colors">
            이체
          </button>
          <div className="w-px bg-white bg-opacity-20"></div>
          <button className="flex-1 py-2 text-center text-sm font-medium hover:bg-black hover:bg-opacity-10 transition-colors">
            카드
          </button>
        </div>
      </div>
    </div>
  );
};

export default BriefAccount;
