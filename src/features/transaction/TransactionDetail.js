import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import SelectPurpose from '../../components/common/SelectPurpose';

const TransactionDetail = () => {
  // 카테고리 상태 관리
  const [selectedCategory, setSelectedCategory] = useState('STORE'); // 기본값을 편의점, 마트로 설정

  // 거래 데이터 (실제로는 props나 API에서 받아올 데이터)
  const transactionData = {
    merchant: '씨유 홍대점',
    amount: -12000,
    category: '편의점, 마트, 잡화',
    date: '2025년 8월 15일 14:00',
    location: '씨유 홍대점',
    cardNumber: '제크카드 결제',
    approvalNumber: '제크카드 결제',
    inputBy: '씨유 홍대점',
    outputBy: '신한은행',
    beforeBalance: 300,
    afterBalance: 300,
    memo: '',
  };

  const formatAmount = amount => {
    const absAmount = Math.abs(amount);
    return amount < 0
      ? `-${absAmount.toLocaleString()}원`
      : `${absAmount.toLocaleString()}원`;
  };

  const formatBalance = balance => {
    return `${balance.toLocaleString()}원`;
  };

  // 카테고리 변경 핸들러
  const handleCategoryChange = categoryCode => {
    setSelectedCategory(categoryCode);
    // 여기서 API 호출이나 다른 로직을 수행할 수 있습니다
    console.log('카테고리가 변경되었습니다:', categoryCode);
  };

  return (
    <div className="min-h-screen">
      {/* 메인 컨텐츠 카드 */}
      <div className="mb-4 bg-white rounded-2xl overflow-hidden">
        {/* 거래 정보 헤더 */}
        <div className="p-6">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-logo-orange rounded-full flex items-center justify-center mr-3">
              <span className="text-sm">🏪</span>
            </div>
            <span className="text-black text-md">
              {transactionData.merchant}
            </span>
          </div>

          <div className="text-3xl font-bold text-black mb-4">
            {formatAmount(transactionData.amount)}
          </div>

          {/* 카테고리 선택 */}
          <div className="mb-4">
            <SelectPurpose
              id="transaction-category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              type="transaction"
            />
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-2 bg-gray-6/60"></div>

        {/* 상세 정보 */}
        <div className="p-6">
          <div className="space-y-4">
            {/* 일시 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">일시</span>
              <span className="text-gray-2">{transactionData.date}</span>
            </div>

            {/* 적요 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">적요</span>
              <span className="text-gray-2">{transactionData.location}</span>
            </div>

            {/* 거래 유형 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">거래 유형</span>
              <span className="text-gray-2">{transactionData.cardNumber}</span>
            </div>

            {/* 거래한 모임원 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">거래한 모임원</span>
              <span className="text-gray-2">
                {transactionData.approvalNumber}
              </span>
            </div>

            {/* 입금자 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">입금자</span>
              <span className="text-gray-2">{transactionData.inputBy}</span>
            </div>

            {/* 출금자 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">출금자</span>
              <span className="text-gray-2">{transactionData.outputBy}</span>
            </div>

            {/* 거래 후 잔액 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">거래 후 잔액</span>
              <span className="text-gray-2">
                {formatBalance(transactionData.beforeBalance)}
              </span>
            </div>

            {/* 메모 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">메모</span>
              <span className="text-gray-2">
                {formatBalance(transactionData.afterBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
