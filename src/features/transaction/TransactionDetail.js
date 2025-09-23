import React, { useCallback, useEffect, useState } from 'react';
import SelectPurpose from '../../components/common/SelectPurpose';
import SelectTC from './SelectTC';
import { ArrowLeft, Edit2, X } from 'lucide-react';
import EditTransaction from './EditTransaction';
import { TransactionAPI } from '../../services/TransactionAPI';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import {
  getTransactionCategoryIconOnly,
  getTransactionTypeName,
} from '../../utils/CategoryIcons';
import dayjs from 'dayjs';
import Loading from '../../components/common/Loading';
import categoryCache from '../../utils/CategoryCache';

const TransactionDetail = () => {
  const { groupData, triggerRefresh } = useOutletContext();
  const navigate = useNavigate();
  const { groupid, satPk } = useParams();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({});
  // 카테고리 상태 관리
  const [selectedCategory, setSelectedCategory] = useState();

  //메모 상태 관리
  const [memo, setMemo] = useState('');

  //모달 상태 관리
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async (newMemo, newCategory) => {
    setLoading(true);

    try {
      //저장
      const param = {
        satPk: satPk,
        memo: newMemo,
        tcPk: newCategory,
      };

      await TransactionAPI.updateDetail(groupid, data.satPk, param);

      setMemo(newMemo);
      setSelectedCategory(newCategory);

      alert('변경이 완료되었어요!');

      triggerRefresh();
    } catch (err) {
      console.log(err);
      alert('변경에 실패했어요!');

      setMemo(data.memo);
      setSelectedCategory(data.tcPk.tcCode);
    } finally {
      setLoading(false);
    }
  };

  //데이터
  const fetchTransaction = useCallback(async () => {
    setLoading(true);
    try {
      const result = await TransactionAPI.getDetail(groupid, satPk);
      setData(result);
      setSelectedCategory(result.tcPk.tcCode);
      setMemo(result.memo);
      console.log(result);
    } catch (err) {
      //에러 발생 시 에러 페이지로 이동
      navigate('/error', {
        state: {
          error: err,
          from: location.pathname,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [groupid, satPk, navigate]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  if (loading) {
    return <Loading />;
  }

  const formatAmount = (ttype, amount) => {
    const absAmount = Math.abs(amount);

    if (ttype === 'DEPOSIT') {
      return `${absAmount}원`;
    } else {
      return `-${absAmount}원`;
    }
  };

  const formatBalance = balance => {
    return `${balance}원`;
  };

  return (
    <div className="min-h-screen">
      {/* 메인 컨텐츠 카드 */}
      <div className="mb-4 bg-white rounded-2xl overflow-hidden">
        {/* 거래 정보 헤더 */}
        <div className="p-6">
          <div className="flex items-center mb-5 justify-between">
            <div className="flex flex-row items-center ">
              <div className="w-10 h-10 bg-group-1 rounded-full flex items-center justify-center mr-3">
                {getTransactionCategoryIconOnly(
                  selectedCategory,
                  'w-6 h-6 text-white'
                )}
              </div>
              <span className="text-gray-1 text-lg font-semibold truncate flex-1">
                {data.briefs}
              </span>
            </div>
            {/* 수정 버튼 */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">수정</span>
            </button>
          </div>

          <div className="text-3xl font-bold text-black mb-4">
            {formatAmount(data.ttype, data.satAmount)}
          </div>
        </div>
        {/* 구분선 */}
        <div className="h-2 bg-gray-6/60"></div>

        {/* 상세 정보 */}
        <div className="p-6">
          <div className="space-y-4">
            {/* 카테고리 선택 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">카테고리</span>
              <span className="text-gray-2">
                {categoryCache.getTransactionCategoryName(selectedCategory)}
              </span>
            </div>
            {/* 일시 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">일시</span>
              <span className="text-gray-2">
                {dayjs(data.satTime).format('YYYY년 MM월 DD일 HH:mm')}
              </span>
            </div>

            {/* 적요 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">적요</span>
              <span className="text-gray-2 max-w-36">{data.briefs}</span>
            </div>

            {/* 거래 유형 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">거래 유형</span>
              <span className="text-gray-2">
                {getTransactionTypeName(data.ttype)}
              </span>
            </div>

            {/* 거래한 모임원 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">거래한 모임원</span>
              <span className="text-gray-2 truncate max-w-36">
                {data.groupMember}
              </span>
            </div>

            {/* 입금자 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">입금자</span>
              <span className="text-gray-2  max-w-36">
                {data.depositDestination ? data.depositDestination : '--'}
              </span>
            </div>

            {/* 출금자 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">출금자</span>
              <span className="text-gray-2  max-w-36">
                {data.withdrawDestination ? data.withdrawDestination : '--'}
              </span>
            </div>

            {/* 거래 후 잔액 */}
            <div className="flex items-center justify-between">
              <span className="text-gray-2">거래 후 잔액</span>
              <span className="text-gray-2">{formatBalance(data.balance)}</span>
            </div>

            {/* 메모 */}
            <div className="flex flex-col items-start">
              <div className="text-gray-2 pb-3">메모</div>
              <div className="w-full p-4 border border-gray-5 rounded text-gray-2">
                {data.memo}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 수정 모달 */}
      <EditTransaction
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        memo={memo}
        category={selectedCategory}
        data={data}
        onSave={handleSave}
      />
    </div>
  );
};

export default TransactionDetail;
