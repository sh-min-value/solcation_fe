import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiSolidError } from "react-icons/bi";
import Header from './Header';

const ErrorPage = ({ error: propError }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // propError가 있으면 사용, 없으면 location.state에서 가져오기
  const error = propError || location.state?.error;
  console.log("에러로그" , error);
  console.log("location.state" , location.state);
  // 404 에러인지 확인
  const is404 = !error && location.pathname !== '/error';

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100%">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="max-w-md w-full rounded-xl p-8 text-center">

          {/* 에러 아이콘과 메시지 */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <BiSolidError className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <p className="text-lg text-red-600 font-bold">
              {is404 ? '404' : 'ERROR'}
            </p>
            <p className="text-lg text-gray-700 m-1 ml-2">
              {is404
                ? '페이지를 찾을 수 없습니다.'
                : (error?.error?.message || error?.message || `HTTP ${error?.status}: ${error?.statusText}` || '알 수 없는 오류가 발생했습니다.')
              }
            </p>
          </div>

          {/* 액션 버튼 */}
          <button
            onClick={handleGoHome}
            className="w-full bg-light-blue text-third py-3 rounded-lg hover:bg-blue/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
