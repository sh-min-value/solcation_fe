import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SelectTC from './SelectTC';
import { getTransactionCategoryIconOnly } from '../../utils/CategoryIcons';

//로딩 스피너
const LoadingSpinner = ({ size = 4 }) => (
  <div
    className={`animate-spin rounded-full h-${size} w-${size} border-2 border-current border-t-transparent`}
  ></div>
);

const EditTransaction = ({
  isOpen,
  onClose,
  memo,
  category,
  data,
  onSave,
  loading,
}) => {
  const [editMemo, setEditMemo] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // 모달이 열릴 때마다 props 값으로 state 초기화
  useEffect(() => {
    if (isOpen) {
      setEditMemo(memo || '');
      setEditCategory(category || 'FOOD'); // 기본값 설정
    }
  }, [isOpen, memo, category]);

  const handleSave = async () => {
    await onSave(editMemo, editCategory);
    onClose();
  };

  const formatAmount = (ttype, amount) => {
    const absAmount = Math.abs(amount);

    if (ttype === 'DEPOSIT') {
      return `${absAmount.toLocaleString()}원`;
    } else {
      return `-${absAmount.toLocaleString()}원`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 relative">
        {/* 헤더  */}
        <div className="flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-group-1 rounded-full flex items-center justify-center">
              {getTransactionCategoryIconOnly(
                category, // category는 이미 문자열(tcCode)
                'w-6 h-6 text-white'
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-1">
                {data.briefs}
              </h2>
              <p className="text-sm text-gray-500">
                {formatAmount(data.ttype, data.satAmount)}
              </p>
            </div>
          </div>
        </div>
        {/* 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-2 hover:text-gray-600"
          disabled={loading}
        >
          <X size={20} />
        </button>
        {/* 카테고리 수정 */}
        <div className="mb-4">
          <label
            htmlFor="edit-category"
            className="block text-sm text-gray-2 mb-1"
          >
            카테고리
          </label>
          <SelectTC
            id="edit-category"
            value={editCategory}
            onChange={newCategory => {
              console.log('카테고리 변경:', newCategory);
              setEditCategory(newCategory);
            }}
            type="transaction"
          />
        </div>
        {/* 메모 수정 */}
        <div>
          <label
            htmlFor="edit-memo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            메모
          </label>
          <textarea
            id="edit-memo"
            value={editMemo}
            onChange={e => {
              console.log('메모 변경:', e.target.value);
              setEditMemo(e.target.value);
            }}
            rows={3}
            className="w-full p-4 border border-gray-5 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="메모를 입력하세요 (선택사항)"
            maxLength={50}
          />
          <div className="text-right text-gray-2 text-sm mr-1 mb-3">
            글자수 {Math.min(editMemo?.length || 0, 50)}/50
          </div>
        </div>
        {/* 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-gray-6 hover:bg-gray-5/70 text-gray-700 rounded-xl font-semibold transition-colors"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-4 px-6 ${
              loading ? 'bg-gray-4' : 'bg-main/80'
            } hover:bg-main text-white rounded-xl font-semibold transition-colors shadow-lg`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size={3} />
                <span>저장 중</span>
              </div>
            ) : (
              '저장'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransaction;
