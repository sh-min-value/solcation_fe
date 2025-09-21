import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CancelModal = ({ isOpen, onConfirm, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error('카드 해지 오류:', error);
      navigate('/error', {
        state: {
          error: error.response,
          from: location.pathname,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return; // 로딩 중일 때는 취소 불가
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-80 mx-4 overflow-hidden">
        {/* 메시지 영역 */}
        <div className="px-6 py-8 text-center">
          <p className="text-lg font-medium text-gray-1">
            카드를 해지하시겠습니까?
          </p>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-5"></div>

        {/* 버튼 영역 */}
        <div className="flex">
          {/* 취소 버튼 */}
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className={`flex-1 py-4 text-center font-medium border-r border-gray-5 transition-colors ${
              isLoading
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-1 hover:bg-gray-6'
            }`}
          >
            아니요
          </button>

          {/* 확인 버튼 */}
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center ${
              isLoading
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-1 hover:bg-gray-6'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>처리중...</span>
              </div>
            ) : (
              '네'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

CancelModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CancelModal;
