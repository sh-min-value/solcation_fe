import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Header from "../common/Header.js";
import { TravelAPI } from "../../services/TravelAPI";
import { getTravelProfileImage } from "../../services/s3";
import { getStateIcon, getTravelCategoryIcon } from "../../utils/CategoryIcons";

export default function TravelLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupid, travelid } = useParams();
  const [travelInfo, setTravelInfo] = useState(null);
  const [travelImageUrl, setTravelImageUrl] = useState(null);

  const isTravelRoute = travelid && location.pathname.includes('/travel/');

  // 여행 정보 로드
  useEffect(() => {
    if (isTravelRoute && travelid && groupid) {
      const loadTravelData = async () => {
        try {
          const data = await TravelAPI.getTravel(travelid, groupid);
          setTravelInfo(data);
        } catch (error) {
          console.error('여행 데이터 로드 실패:', error);
          navigate('/error', {
            state: {
              error: error,
              from: location.pathname,
            },
          });
          setTravelInfo(null);
        }
      };
      loadTravelData();
    } else {
      setTravelInfo(null);
    }
  }, [isTravelRoute, travelid, groupid]);

  // 여행 이미지 로딩
  useEffect(() => {
    const loadTravelImage = async () => {
      if (travelInfo?.thumbnail) {
        try {
          const url = await getTravelProfileImage(travelInfo.thumbnail);
          setTravelImageUrl(url);
        } catch (error) {
          console.error('여행 이미지 로드 실패:', error);
        }
      }
    };
    loadTravelImage();
  }, [travelInfo?.thumbnail]);

  const showTravelBanner = isTravelRoute && travelInfo;

  // 날짜 포맷팅 함수
  const formatDate2 = (dateString) => {
    if (!dateString) return '';
    return dateString.replace(/-/g, '.');
  };

  // 여행 총 날짜 계산
  const getTravelDays = () => {
    if (!travelInfo?.startDate || !travelInfo?.endDate) return 3;

    const startDate = new Date(travelInfo.startDate);
    const endDate = new Date(travelInfo.endDate);
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 3;
  };

  // 여행 시작일 기준 날짜 포맷팅
  const formatDate = (day) => {
    if (!travelInfo?.startDate) return '';

    const startDate = new Date(travelInfo.startDate);
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + day - 1);

    const month = targetDate.getMonth() + 1;
    const date = targetDate.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[targetDate.getDay()];

    return `${month}.${date}(${dayName})`;
  };

  return (
    <div className="h-screen bg-main flex flex-col">
      <Header
        showBackButton={true}
        title={title}
      />
      {/* 여행 정보 배너 */}
      {showTravelBanner && (
        <div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 flex items-center">
            {/* 왼쪽: 음식 이미지 */}
            <div className="w-20 h-20 bg-white rounded-xl mr-4 flex items-center justify-center overflow-hidden">
              {travelImageUrl ? (
                <img
                  src={travelImageUrl}
                  alt="여행 대표 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-2xl">🍜</span>
                </div>
              )}
            </div>

            {/* 오른쪽: 텍스트 정보 */}
            <div className="flex-1 text-white">
              <div className="flex text-xl font-bold mb-1">
                <h3 className="max-w-28 line-clamp-1 truncate">{travelInfo?.title || '여행 제목'}</h3>
                <p className='text-sm ml-2 mt-1 text-gray-200 max-w-24 line-clamp-1 truncate'> |  {travelInfo?.location || '여행지'}</p>
              </div>
              <p className="text-sm opacity-90 mb-1">
                {travelInfo?.startDate ? formatDate2(travelInfo.startDate) : '시작일'} ~ {travelInfo?.endDate ? formatDate2(travelInfo.endDate) : '종료일'}
              </p>

              <div className="flex space-x-3 text-gray-500 text-xs">
                <div className="bg-white bg-opacity-80 rounded-lg px-3 py-1 flex items-center space-x-1">
                  {getStateIcon(travelInfo?.state, '')}
                </div>
                <div className="bg-white bg-opacity-80 rounded-lg px-3 py-1 flex items-center space-x-1">
                  {getTravelCategoryIcon(travelInfo?.categoryCode)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 스크롤 가능한 메인 콘텐츠 영역 */}
      <div className="flex-1 bg-white rounded-t-3xl overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          {typeof children === 'function'
            ? children({
              travelInfo,
              travelDays: getTravelDays(),
              formatDate
            })
            : children
          }
        </div>
      </div>
    </div>
  );
}
