import React, { useEffect, useState } from 'react';
import { MoreVertical, Copy } from 'lucide-react';
import { TransactionAPI } from '../../services/TransactionAPI';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import cardImg from '../../assets/images/card.png';
import CardTransactionHistory from './CardTransactionHistory';
import CancelModal from './CancelModal';

const Card = () => {
  const navigate = useNavigate();
  const { groupid, sacPk } = useParams();
  const { user } = useAuth();
  const [cardInfo, setCardInfo] = useState({});
  const [copyMessage, setCopyMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthOptions, setMonthOptions] = useState([]);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  //카드 생성일부터 현재까지의 월 옵션 생성
  const generateMonthOptions = createdAt => {
    if (!createdAt) return [];

    const startDate = new Date(createdAt);
    const currentDate = new Date();
    const options = [];

    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    while (current <= end) {
      const year = current.getFullYear();
      const month = current.getMonth() + 1;
      const yearMonth = `${year}-${month.toString().padStart(2, '0')}`;
      const label = `${year}년 ${month}월`;

      options.push({ value: yearMonth, label });
      current.setMonth(current.getMonth() + 1);
    }

    return options.reverse();
  };

  //카드 번호 포맷팅
  const formatCardNumber = cardNum => {
    if (!cardNum) return '';
    return cardNum.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  // 카드번호 복사 처리
  const handleCopyCardNumber = () => {
    if (cardInfo?.cardNum) {
      navigator.clipboard.writeText(cardInfo?.cardNum);
      setCopyMessage('복사되었습니다!');
      setTimeout(() => {
        setCopyMessage('');
      }, 2000);
    }
  };

  //선택된 월의 라벨 get
  const getSelectedMonthLabel = () => {
    const option = monthOptions.find(opt => opt.value === selectedMonth);
    return option ? option.label : '월 선택';
  };

  //카드 해지
  const onConfirm = async () => {
    try {
      await TransactionAPI.cancelCard(groupid, sacPk);
      alert('카드 해지가 완료되었어요!');
      navigate(`/group/${groupid}/account`);
    } catch (error) {
      alert('카드 해지 중 오류가 발생했어요!');
    } finally {
      setShowCancelModal(false);
    }
  };

  // 카드 스켈레톤 컴포넌트
  const CardSkeleton = () => (
    <div className="w-full h-50 px-3 py-3">
      <div className="flex items-start justify-between mb-4 flex-1">
        <div className="flex items-center h-24 flex-1">
          {/* 카드 이미지 스켈레톤 */}
          <div className="w-16 h-16 bg-gray-200 rounded mr-4 animate-pulse"></div>

          {/* 카드 정보 스켈레톤 */}
          <div className="flex-1">
            <div className="flex items-baseline gap-1 mb-2">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* 이용 금액 스켈레톤 */}
      <div className="bg-gray-100 rounded-xl px-4 py-3 text-center">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mx-auto"></div>
      </div>
    </div>
  );

  useEffect(() => {
    const loadInfo = async () => {
      setLoading(true);
      try {
        const response = await TransactionAPI.getCardInfo(groupid, sacPk);
        setCardInfo(response);
        console.log(response);

        const options = generateMonthOptions(response.createdAt);
        setMonthOptions(options);

        if (options.length > 0) {
          setSelectedMonth(options[0].value);
        }

        console.log(options);
      } catch (err) {
        navigate('/error', {
          state: {
            error: err.response,
            from: location.pathname,
          },
        });
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (groupid && sacPk) {
      loadInfo();
    }
  }, [groupid, sacPk]);

  return (
    <div className="h-screen min-h-0">
      <div className="overflow-y-auto pb-24 scroll-pb-24">
        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="w-full h-50 px-3 py-3">
            <div className="flex items-start justify-between mb-4 flex-1">
              <div className="flex items-center h-24 flex-1">
                {/* 카드 이미지 */}
                <div className="w-16 h-16 bg-blue-500 rounded mr-4 flex items-center justify-center">
                  <img src={cardImg} alt="card" className="rotate-90 rounded" />
                </div>
                {/* 카드 정보 */}
                <div className="flex-1">
                  <div className="text-third font-bold text-lg flex items-baseline gap-1">
                    <span className="truncate max-w-24">{user?.userName}</span>
                    <span className="text-gray-600 font-normal flex-shrink-0">
                      님의 카드
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base relative">
                    <span className="tracking-tight underline text-underline-offset-1 text-sm text-third font-semibold">
                      {formatCardNumber(cardInfo?.cardNum)}
                    </span>
                    <Copy
                      className="w-4 h-4 cursor-pointer text-third"
                      onClick={handleCopyCardNumber}
                    />
                    {/* 복사 완료 메시지 */}
                    {copyMessage && (
                      <div className="absolute top-5 left-11 transform -translate-x-1/2 bg-opacity-80 text-third text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                        {copyMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* 취소 모달 */}
              <div className="relative">
                <MoreVertical
                  className="w-5 h-5 text-gray-400 cursor-pointer"
                  onClick={() => setShowModal(true)}
                />
                {showModal && (
                  <>
                    {/* 배경 오버레이 */}
                    <div
                      role="button"
                      tabIndex={0}
                      className="fixed inset-0 z-[51]"
                      onClick={() => setShowModal(false)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === 'Escape') {
                          e.preventDefault();
                          setShowModal(false);
                        }
                      }}
                      aria-label="close modal"
                    />

                    {/* 모달 */}
                    <div className="absolute top-6 right-0 z-[60]">
                      <div className="bg-white text-gray-1 rounded-xl px-1 py-1 shadow-lg min-w-24">
                        <button
                          onClick={() => {
                            setShowModal(false);
                            setShowCancelModal(true);
                          }}
                          className="w-full text-center text-sm font-medium py-2 px-3 rounded-lg transition-colors hover:bg-gray-6"
                        >
                          카드 해지
                        </button>
                      </div>
                    </div>
                  </>
                )}
                <CancelModal
                  isOpen={showCancelModal}
                  onConfirm={onConfirm}
                  onCancel={() => setShowCancelModal(false)}
                />
              </div>
            </div>
            {/* 이용 금액 */}
            <div className="bg-light-blue rounded-xl px-4 py-3 text-center">
              <div className="text-third text-sm">
                이번달 이용금액은{' '}
                <span className="text-third font-bold text-lg">
                  {cardInfo?.totalCost?.toLocaleString()}
                </span>
                원이에요
              </div>
            </div>
          </div>
        )}

        {!loading && selectedMonth && (
          <CardTransactionHistory
            groupId={groupid}
            yearMonth={selectedMonth}
            monthOptions={monthOptions}
            onMonthChange={setSelectedMonth}
          />
        )}
      </div>
    </div>
  );
};

export default Card;
