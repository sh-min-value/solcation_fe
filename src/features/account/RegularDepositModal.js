import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
// import { getEmoji } from '../../utils/CategoryIcons';

const RegularDepositModal = ({ isOpen, onClose }) => {
  const [frequency, setFrequency] = useState('매달');
  const [day, setDay] = useState('10일');
  const [amount, setAmount] = useState('100000');
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [showDayDropdown, setShowDayDropdown] = useState(false);

  const frequencies = ['매달', '매주', '매년'];
  const days = Array.from({ length: 31 }, (_, i) => `${i + 1}일`);

  if (!isOpen) return null;

  const handleAmountChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const formatAmount = value => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 cursor-default">
      <div className="bg-white rounded-3xl w-full max-w-md mx-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              {/*{getEmoji('alarm-clock', 10)}*/}
            </div>
            <h2 className="text-xl font-extrabold text-black">
              정기 입금일 설정
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-4">
          <p className="text-gray-2 text-sm">
            정기적으로 멤버들에게 알림을 보낼 수 있어요 :)
          </p>
        </div>

        {/* Form */}
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
                onClick={() => setShowFrequencyDropdown(!showFrequencyDropdown)}
                className="w-full flex items-center justify-between px-0 py-1 border-b border-gray-4 bg-transparent text-lg font-medium focus:outline-none focus:border-blue-500 text-gray-1"
                aria-expanded={showFrequencyDropdown}
                aria-haspopup="listbox"
              >
                {frequency}
                <ChevronDown className="w-5 h-5 text-gray-2" />
              </button>
              {showFrequencyDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                  {frequencies.map(freq => (
                    <button
                      key={freq}
                      onClick={() => {
                        setFrequency(freq);
                        setShowFrequencyDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-1"
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
                onClick={() => setShowDayDropdown(!showDayDropdown)}
                className="w-full flex items-center justify-between px-0 py-1 border-b border-gray-4 bg-transparent text-lg font-medium focus:outline-none focus:border-blue-500 text-gray-1"
                aria-expanded={showDayDropdown}
                aria-haspopup="listbox"
              >
                {day}
                <ChevronDown className="w-5 h-5 text-gray-2" />
              </button>
              {showDayDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
                  {days.map(d => (
                    <button
                      key={d}
                      onClick={() => {
                        setDay(d);
                        setShowDayDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-gray-1"
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
            <div className="flex items-center border-b border-gray-4 focus-within:border-blue-500">
              <input
                id="amount-input"
                type="text"
                value={formatAmount(amount)}
                onChange={handleAmountChange}
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
