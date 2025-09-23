import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { AccountAPI } from '../../services/AccountAPI';
import { EmojiProvider, Emoji } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

//로딩 스피너
const LoadingSpinner = ({ size = 4 }) => (
  <div
    className={`animate-spin rounded-full h-${size} w-${size} border-2 border-current border-t-transparent`}
  ></div>
);

const RegularDepositModal = ({ isOpen, onClose, groupId, accountInfo }) => {
  const [frequency, setFrequency] = useState('');
  const [day, setDay] = useState('');
  const [amount, setAmount] = useState('');
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { groupData, triggerRefresh } = useOutletContext();
  const { user } = useAuth();
  const [isGroupLeader, setIsGroupLaeader] = useState(false);
  const frequencies = ['매달', '매주'];
  const date = Array.from({ length: 31 }, (_, i) => `${i + 1}일`);
  const days = [
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
    '일요일',
  ];

  //초기값 설정 함수
  const setInitVal = () => {
    //그룹 리더인지 확인
    setIsGroupLaeader(user?.userPk === groupData?.leaderPk);
    console.log(groupData?.leaderPk === user?.userPk);
    if (accountInfo) {
      // 주기 설정
      if (accountInfo.depositCycle === 'MONTH') {
        setFrequency('매달');
        if (accountInfo.depositDate) {
          setDay(`${accountInfo.depositDate}일`);
        } else {
          setDay('1일');
        }
      } else if (accountInfo.depositCycle === 'WEEK') {
        setFrequency('매주');
        if (accountInfo.depositDay) {
          const dayMap = {
            MON: '월요일',
            TUE: '화요일',
            WED: '수요일',
            THU: '목요일',
            FRI: '금요일',
            SAT: '토요일',
            SUN: '일요일',
          };
          setDay(dayMap[accountInfo.depositDay] || '월요일');
        } else {
          setDay('월요일');
        }
      } else {
        // depositCycle이 없으면 기본값
        setFrequency('매달');
        setDay('1일');
      }

      // 금액 설정
      if (accountInfo.depositAmount) {
        setAmount(accountInfo.depositAmount.toString());
      } else {
        setAmount('100000');
      }
    } else {
      // accountInfo가 없을 때 기본값 설정
      setFrequency('매달');
      setDay('1일');
      setAmount('100000');
    }
  };

  //모달 닫기
  const closeModal = () => {
    setShowFrequencyDropdown(false);
    setShowDayDropdown(false);
    // 모달이 닫힐 때는 초기값으로 되돌리지 않음 (현재 accountInfo 상태 유지)
    onClose();
  };

  // accountInfo가 변경될 때마다 초기값 설정
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때만 초기값 설정
      setInitVal();
    }
  }, [accountInfo, isOpen]);

  if (!isOpen) return null;

  const handleAmountChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const formatAmount = value => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 요일 코드 변환
  const getDayCode = dayName => {
    const dayMap = {
      월요일: 'MON',
      화요일: 'TUE',
      수요일: 'WED',
      목요일: 'THU',
      금요일: 'FRI',
      토요일: 'SAT',
      일요일: 'SUN',
    };
    return dayMap[dayName] || 'MON';
  };

  //리셋 설정
  const handleResetRegularDeposit = async () => {
    if (!accountInfo?.saPk) {
      console.error('계좌 정보가 없습니다.');
      return;
    }

    setIsResetting(true);

    try {
      await AccountAPI.resetRegularDeposit(groupId, accountInfo.saPk);
      // 리셋 성공 후 기본값으로 설정
      setFrequency('매달');
      setDay('1일');
      setAmount('100000');

      alert('초기화가 완료되었어요!');
    } catch (error) {
      console.error('정기 입금일 리셋 오류:', error);
      alert('초기화 중 오류가 발생했어요!');
    } finally {
      closeModal();
      setIsResetting(false);
      triggerRefresh();
    }
  };

  // 정기 입금일 설정
  const handleSetRegularDeposit = async () => {
    if (!accountInfo?.saPk) {
      console.error('계좌 정보가 없습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const depositData = {
        saPk: accountInfo.saPk,
        depositAlarm: true,
        depositCycle: frequency === '매달' ? 'MONTH' : 'WEEK',
        depositDate:
          frequency === '매달' ? parseInt(day.replace('일', '')) : null,
        depositDay: frequency === '매주' ? getDayCode(day) : null,
        depositAmount: parseInt(amount.replace(/,/g, '')),
      };

      await AccountAPI.setRegularDeposit(groupId, depositData);

      alert('정기 입금일 변경이 완료되었어요!');
    } catch (error) {
      console.error('정기 입금일 설정 오류:', error);
      alert('정기 입금일 변경 중 오류가 발생했어요!');
    } finally {
      closeModal();
      setIsLoading(false);
      triggerRefresh();
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 cursor-default">
      <div className="bg-white rounded-3xl w-full max-w-md mx-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <EmojiProvider data={emojiData}>
                <Emoji name={'alarm-clock'} size={7} className="w-10 h-10" />
              </EmojiProvider>
            </div>
            <h2 className="text-xl font-extrabold text-black">
              정기 입금일 설정
            </h2>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-6 transition-colors"
          >
            <X className="w-5 h-5 text-gray-2" />
          </button>
        </div>

        <div className="px-6 pb-4">
          <p className="text-gray-2 text-sm">
            정기적으로 멤버들에게 알림을 보낼 수 있어요 :)
          </p>
        </div>

        <div className="px-6 pb-6 space-y-6">
          {/* 입금 주기 */}
          <div>
            <label
              htmlFor="frequency-select"
              className="block text-sm font-medium text-gray-2 mb-1"
            >
              입금 주기
            </label>
            <div className="relative">
              <button
                id="frequency-select"
                onClick={() =>
                  isGroupLeader &&
                  setShowFrequencyDropdown(!showFrequencyDropdown)
                }
                disabled={!isGroupLeader}
                className="w-full flex items-center justify-between px-0 py-1 border-b border-gray-4 bg-transparent text-lg font-medium focus:outline-none focus:border-blue text-gray-1"
                aria-expanded={showFrequencyDropdown}
                aria-haspopup="listbox"
              >
                {frequency}
                {isGroupLeader && (
                  <ChevronDown className="w-5 h-5 text-gray-2" />
                )}
              </button>
              {showFrequencyDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-5 rounded-lg shadow-lg z-10 mt-1">
                  {frequencies.map(freq => (
                    <button
                      key={freq}
                      onClick={() => {
                        setFrequency(freq);
                        setShowFrequencyDropdown(false);
                        setDay(freq === '매달' ? '1일' : '월요일');
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-6 transition-colors text-gray-1"
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* 입금 기준일 */}
          <div>
            <label
              htmlFor="day-select"
              className="block text-sm font-medium text-gray-2 mb-1"
            >
              입금 기준일
            </label>
            <div className="relative">
              <button
                id="day-select"
                onClick={() =>
                  isGroupLeader && setShowDayDropdown(!showDayDropdown)
                }
                disabled={!isGroupLeader}
                className="w-full flex items-center justify-between px-0 py-1 border-b border-gray-4 bg-transparent text-lg font-medium focus:outline-none focus:border-blue text-gray-1"
                aria-expanded={showDayDropdown}
                aria-haspopup="listbox"
              >
                {day}
                {isGroupLeader && (
                  <ChevronDown className="w-5 h-5 text-gray-2" />
                )}
              </button>
              {showDayDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                  {(frequency === '매달' ? date : days).map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        setDay(d);
                        setShowDayDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-6 transition-colors text-gray-1"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* 금액 */}
          <div>
            <label
              htmlFor="amount-input"
              className="block text-sm font-medium text-gray-2 mb-1"
            >
              금액
            </label>
            <div className="flex items-center border-b border-gray-4 focus-within:border-blue">
              <input
                id="amount-input"
                type="text"
                value={formatAmount(amount)}
                onChange={handleAmountChange}
                disabled={!isGroupLeader}
                className="flex-1 px-0 py-1 bg-transparent text-lg font-medium focus:outline-none text-gray-1"
                placeholder="100000"
                aria-describedby="amount-currency"
              />
              <span
                id="amount-currency"
                className="text-lg font-medium text-gray-1 ml-2"
              >
                원
              </span>
            </div>
          </div>
          {isGroupLeader && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleResetRegularDeposit}
                disabled={isResetting || isLoading}
                className="flex-1 py-4 px-6 bg-gray-6 hover:bg-gray-5/70 disabled:bg-gray-4 disabled:cursor-not-allowed text-gray-700 disabled:text-gray-500 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {isResetting ? (
                  <>
                    <LoadingSpinner size={4} />
                    <span>초기화...</span>
                  </>
                ) : (
                  '초기화'
                )}
              </button>
              <button
                onClick={handleSetRegularDeposit}
                disabled={isLoading || isResetting}
                className="flex-1 py-4 px-6 bg-main/80 hover:bg-main disabled:bg-main/50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size={4} />
                    <span>저장 중...</span>
                  </>
                ) : (
                  '저장'
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegularDepositModal;
