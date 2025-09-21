import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { AccountAPI } from '../../../services/AccountAPI';
import { getTransactionCategoryIcon } from '../../../utils/CategoryIcons';

const TransactionHistory = ({ groupId }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // 거래내역 조회
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await AccountAPI.getTransactionHistory(groupId);
        setTransactions(response.data || response);
      } catch (error) {
        console.error('거래내역 조회 오류:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [groupId]);

  // 날짜 포맷팅
  const formatDate = dateString => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()}`;
  };

  // 시간 포맷팅
  const formatTime = dateString => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  // 금액 포맷팅
  const formatAmount = amount => {
    return Math.abs(amount).toLocaleString('ko-KR');
  };

  // 거래 유형 한글 변환
  const getTransactionType = ttype => {
    switch (ttype) {
      case 'WITHDRAW':
        return '출금';
      case 'DEPOSIT':
        return '입금';
      case 'CARD':
        return '체크카드 결제';
      default:
        return ttype;
    }
  };

  // 필터링된 거래내역
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === null) return true;
    return transaction.ttype === filter;
  });

  // 날짜별로 그룹화
  const groupedTransactions = filteredTransactions.reduce(
    (groups, transaction) => {
      const date = formatDate(transaction.satTime);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {}
  );

  // 필터
  const filterOptions = [
    { value: null, label: '전체' },
    { value: 'DEPOSIT', label: '입금' },
    { value: 'WITHDRAW', label: '출금' },
    { value: 'CARD', label: '카드' },
  ];

  const getFilterText = () => {
    const option = filterOptions.find(opt => opt.value === filter);
    return option ? option.label : '전체';
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-4">
        <div className="text-center text-gray-2">거래내역을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      <div className="w-full mt-6 mb-4 relative">
        <div
          className="inline-flex items-center cursor-pointer px-2 pl-3 py-1 w-16 flex flex-row justify-between"
          onClick={() => setShowDropdown(!showDropdown)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              setShowDropdown(!showDropdown);
            }
          }}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        >
          <span className="text-sm text-gray-2">{getFilterText()}</span>
          <svg
            className={`w-3 h-3 text-gray-2 transition-transform ml-1 ${
              showDropdown ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {showDropdown && (
          <div className="absolute z-10 bg-white border border-gray-5 rounded-md shadow-lg mt-1 min-w-fit w-16">
            {filterOptions.map(option => (
              <div
                key={option.value || 'all'}
                className={`px-2 pl-3 py-2 text-sm cursor-pointer text-left w-16 ${
                  filter === option.value
                    ? 'bg-main text-white'
                    : 'text-gray-2 hover:bg-gray-6'
                }`}
                role="option"
                tabIndex={0}
                aria-selected={filter === option.value}
                onClick={() => {
                  setFilter(option.value);
                  setShowDropdown(false);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setFilter(option.value);
                    setShowDropdown(false);
                  }
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 거래내역 리스트 */}
      {Object.keys(groupedTransactions).length === 0 ? (
        <div className="text-center text-gray-2 py-8">거래내역이 없습니다.</div>
      ) : (
        Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
          <div key={date} className="space-y-4 mb-6">
            <div className="flex flex-row w-full items-start">
              {/* 날짜 헤더 */}
              <div className="text-gray-2 text-sm font-medium mb-2 px-2 pl-3 w-14 flex-shirink">
                {date}
              </div>

              {/* 해당 날짜의 거래내역 */}
              <div className="flex-1 space-y-3">
                {dayTransactions.map(transaction => (
                  <div
                    key={transaction.satPk}
                    className="flex items-center justify-between px-2 cursor-pointer hover:bg-gray-6 transition-colors"
                    onClick={() =>
                      navigate(
                        `/group/${groupId}/account/transaction/${transaction.satPk}`
                      )
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        navigate(
                          `/group/${groupId}/account/transaction/${transaction.satPk}`
                        );
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-gray-1 text-sm font-bold">
                          {transaction.briefs}
                        </div>

                        <div className="bg-light-blue rounded-full px-2 py-0.5 flex items-center text-[8px]">
                          {getTransactionCategoryIcon(
                            transaction.tcCode,
                            'w-2.5 h-2.5 text-black mr-1'
                          )}
                        </div>
                      </div>

                      <div className="text-gray-3 text-[10px]">
                        {formatTime(transaction.satTime)} |{' '}
                        {getTransactionType(transaction.ttype)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          transaction.ttype === 'DEPOSIT'
                            ? 'text-main'
                            : 'text-gray-1'
                        }`}
                      >
                        {transaction.ttype === 'DEPOSIT' ? '+' : '-'}
                        {formatAmount(transaction.satAmount)}원
                      </div>

                      <div className="text-gray-3 text-xs mt-1">
                        {formatAmount(transaction.balance)}원
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

TransactionHistory.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default TransactionHistory;
