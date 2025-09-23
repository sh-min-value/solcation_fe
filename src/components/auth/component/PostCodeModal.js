import React, { useState, useEffect } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import InputForm from './InputForm';

const PostCodeModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">주소 검색</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
        <DaumPostcodeEmbed
          onComplete={onComplete}
          onClose={onClose}
          style={{ height: '400px' }}
        />
      </div>
    </div>
  );
};

export default PostCodeModal;
