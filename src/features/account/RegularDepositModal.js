import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { AccountAPI } from '../../services/AccountAPI';

const RegularDepositModal = ({ isOpen, onClose, groupId, isGroupLeader }) => {
  const [frequency, setFrequency] = useState('');
  const [day, setDay] = useState('');
  const [amount, setAmount] = useState('');
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [showDayDropdown, setShowDayDropdown] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [regularDepositInfo, setRegularDepositInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // 계좌 정보 조회
  useEffect(() => {
    const fetchAccountInfo = async () => {
      if (isOpen && groupId) {
        setIsLoading(true);
        try {
          const response = await AccountAPI.getAccountInfo(groupId);
          const accountData = response.data || response;

          setAccountInfo(accountData);

          if (accountData.depositCycle) {
            setRegularDepositInfo({
              depositCycle: accountData.depositCycle,
              depositDate: accountData.depositDate,
              depositDay: accountData.depositDay,
              depositAmount: accountData.depositAmount,
              depositAlarm: accountData.depositAlarm,
            });
          }
        } catch (error) {
          console.error('계좌 정보 조회 오류:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAccountInfo();
  }, [isOpen, groupId]);

  // 초기값 설정
  useEffect(() => {
    if (regularDepositInfo) {
      // 주기 설정
      if (regularDepositInfo.depositCycle === 'MONTH') {
        setFrequency('매달');
        if (regularDepositInfo.depositDate) {
          setDay(`${regularDepositInfo.depositDate}일`);
        }
      } else if (regularDepositInfo.depositCycle === 'WEEK') {
        setFrequency('매주');
        if (regularDepositInfo.depositDay) {
          const dayMap = {
            MON: '월요일',
            TUE: '화요일',
            WED: '수요일',
            THU: '목요일',
            FRI: '금요일',
            SAT: '토요일',
            SUN: '일요일',
          };
          setDay(dayMap[regularDepositInfo.depositDay] || '월요일');
        }
      }

      // 금액 설정
      if (regularDepositInfo.depositAmount) {
        setAmount(regularDepositInfo.depositAmount.toString());
      }
    } else {
      // 정기입금 정보가 없을 때 기본값 설정
      setFrequency('매달');
      setDay('1일');
      setAmount('100000');
    }
  }, [regularDepositInfo]);

  if (!isOpen || isLoading) return null;

  const handleAmountChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const formatAmount = value => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 요일
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

  // 정기 입금일 설정
  const handleSetRegularDeposit = async () => {
    if (!accountInfo?.saPk) {
      console.error('계좌 정보가 없습니다.');
      return;
    }

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
      onClose();
    } catch (error) {
      console.error('정기 입금일 설정 오류:', error);
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 cursor-default">
      <div className="bg-white rounded-3xl w-full max-w-md mx-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center"></div>
            <h2 className="text-xl font-extrabold text-black">
              정기 입금일 설정
            </h2>
          </div>
          <button
            onClick={isGroupLeader ? handleSetRegularDeposit : onClose}
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
        </div>
      </div>
    </div>
  );
};

export default RegularDepositModal;
