import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { TbBulb } from 'react-icons/tb';
import { statAPI } from '../../../services/StatAPI';

const InsightSection = ({ groupid, travelId }) => {
  // 상태 관리
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [insightData, setInsightData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 인사이트 버튼 클릭 핸들러
  const handleInsightClick = async () => {
    setShowInsightModal(true);
    setLoading(true);

    try {
      const response = await statAPI.getInsight(groupid, travelId);
      const textData = response.msg;
      const parsedData = parseInsightText(textData);
      setInsightData(parsedData);
    } catch (error) {
      console.error('인사이트 데이터 로드 실패:', error);
      setInsightData(null);
    } finally {
      setLoading(false);
    }
  };

  // 텍스트 데이터를 파싱
  const parseInsightText = text => {
    if (!text) return null;

    const lines = text.split('\n').filter(line => line.trim());
    const result = {};

    lines.forEach(line => {
      if (line.includes('패턴:')) {
        result.pattern = line.replace('패턴:', '').trim();
      } else if (line.includes('절약:')) {
        result.savings = line.replace('절약:', '').trim();
      } else if (line.includes('비교:')) {
        result.comparison = line.replace('비교:', '').trim();
      }
    });

    return result;
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowInsightModal(false);
    setInsightData(null);
  };

  // 플로팅 버튼 컴포넌트
  const FloatingButton = () => (
    <div
      style={{
        position: 'fixed',
        bottom: '90px',
        zIndex: 30,
        left: 'max(24px, calc(50vw - -120px))',
        width: 'fit-content',
        height: 'fit-content',
        pointerEvents: 'auto',
      }}
    >
      <button
        onClick={handleInsightClick}
        className="w-12 h-12 bg-main rounded-full shadow-2xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-105"
        style={{
          marginLeft: 'auto',
          marginRight: '0',
          boxShadow:
            '0 8px 20px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.15)',
        }}
      >
        <TbBulb className="w-6 h-6 text-white" />
      </button>
    </div>
  );

  // 인사이트 모달 컴포넌트
  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xs w-full mx-auto">
        {/* 모달 헤더 */}
        <div className="bg-main p-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TbBulb className="w-6 h-6" />
              <h3 className="text-lg font-bold">AI 여행 인사이트</h3>
            </div>
            <button
              onClick={handleCloseModal}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 모달 내용 */}
        <div className="p-6 pb-8">
          <div className="space-y-4">
            {/* 소비 패턴 분석 섹션 */}
            <div className="bg-gray-6 p-4 rounded-lg">
              <h4 className="font-bold text-third mb-2">소비 패턴 분석</h4>
              <p className="text-gray-1 text-sm">
                {loading
                  ? '로딩 중...'
                  : insightData?.pattern || '패턴 분석 데이터가 없습니다.'}
              </p>
            </div>

            {/* 절약 팁 섹션 */}
            <div className="bg-gray-6 p-4 rounded-lg">
              <h4 className="font-bold text-third mb-2">절약 팁</h4>
              <p className="text-gray-1 text-sm">
                {loading
                  ? '로딩 중...'
                  : insightData?.savings || '절약 팁 데이터가 없습니다.'}
              </p>
            </div>

            {/* 그룹 평균 비교 섹션 */}
            <div className="bg-gray-6 p-4 rounded-lg">
              <h4 className="font-bold text-third mb-2">그룹 평균 비교</h4>
              <p className="text-gray-1 text-sm">
                {loading
                  ? '로딩 중...'
                  : insightData?.comparison || '비교 분석 데이터가 없습니다.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {createPortal(<FloatingButton />, document.body)}
      {showInsightModal && createPortal(<Modal />, document.body)}
    </>
  );
};

export default InsightSection;
