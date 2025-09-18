import React from 'react';
import PropTypes from 'prop-types';

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-80 mx-4 overflow-hidden">
        {/* 메시지 영역 */}
        <div className="px-6 py-8 text-center">
          <p className="text-lg font-medium text-gray-1">
            로그아웃하시겠습니까?
          </p>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-5"></div>

        {/* 버튼 영역 */}
        <div className="flex">
          {/* 취소 버튼 */}
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-center text-gray-1 font-medium hover:bg-gray-6 transition-colors border-r border-gray-5"
          >
            아니요
          </button>

          {/* 확인 버튼 */}
          <button
            onClick={onConfirm}
            className="flex-1 py-4 text-center text-gray-1 font-medium hover:bg-gray-6 transition-colors"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

LogoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default LogoutModal;
