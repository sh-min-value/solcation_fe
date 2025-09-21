import React, { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  useOutletContext,
} from 'react-router-dom';
import TravelCard from '../../components/common/TravelCard';
import { statAPI } from '../../services/StatAPI';
import emptySol from '../../assets/images/empty_sol.svg';
import TravelStatsView from './components/TravelStatsView';
import OverallStatsView from './components/OverallStatsView';

// 로딩 스피너
const LoadingSpinner = () => (
  <div className="text-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-2 mx-auto mb-2"></div>
    <p className="text-gray-2">완료한 여행을 불러오는 중...</p>
  </div>
);

const Stat = () => {
  const { groupid, travelid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { groupData, triggerRefresh } = useOutletContext();

  // 전체 통계 페이지 확인
  const isOverallStats = location.pathname.includes('/stats/overall');

  const [finishedTravels, setFinishedTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTravel, setSelectedTravel] = useState(null);

  // 여행 데이터를 변환
  const convertTravelToTravelCardFormat = travel => ({
    title: travel.tpTitle,
    thumbnail: travel.tpImage,
    location: travel.tpLocation,
    startDate: travel.tpStart,
    endDate: travel.tpEnd,
    state: 'FINISH',
    categoryCode: travel.tpcCode,
    tpPk: travel.tpPk,
  });

  // 여행 목록 로드
  useEffect(() => {
    const fetchFinishedTravels = async () => {
      if (!groupid) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const travelsResponse = await statAPI.getFinishedTravels(groupid);
        const convertedTravels = Array.isArray(travelsResponse)
          ? travelsResponse.map(convertTravelToTravelCardFormat)
          : [];
        setFinishedTravels(convertedTravels);
      } catch (error) {
        setFinishedTravels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinishedTravels();
  }, [groupid]);

  // 페이지 상태 관리
  useEffect(() => {
    if (travelid === 'overall') {
      setSelectedTravel(null);
    } else if (travelid && finishedTravels.length > 0) {
      const travel = finishedTravels.find(t => t.tpPk === parseInt(travelid));
      if (travel) {
        setSelectedTravel(travel);
      }
    } else {
      setSelectedTravel(null);
    }
  }, [travelid, finishedTravels]);

  // 전체 통계 버튼 클릭 핸들러
  const handleOverallStatsClick = () => {
    navigate(`/group/${groupid}/stats/overall`);
  };

  if (selectedTravel) {
    return <TravelStatsView travel={{ ...selectedTravel, groupid }} />;
  }

  if (travelid === 'overall' || isOverallStats) {
    return <OverallStatsView groupid={groupid} groupInfo={groupData} />;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* 전체 여행 소비 패턴 분석 버튼 */}
      {finishedTravels && finishedTravels.length > 0 && (
        <div className="mb-4">
          <button
            onClick={handleOverallStatsClick}
            className="w-full bg-light-blue hover:bg-blue-200 rounded-xl p-4 shadow-lg transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {groupData?.groupName || '그룹'} 여행 소비 패턴 분석
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-blue-500 transition-colors">
                  전체 여행 통계 보기
                </p>
              </div>
            </div>
            <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* 여행 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : !finishedTravels || finishedTravels.length === 0 ? (
          <div className="text-center py-12">
            <img
              src={emptySol}
              alt="완료한 여행이 없음"
              className="w-48 h-48 mx-auto mb-6"
            />
            <p className="text-gray-1 text-lg mb-2">
              앗, 아직 여행기록이 없어요!
            </p>
            <p className="text-gray-2 text-lg">
              여행을 떠나고 소비 분석 받아보세요
            </p>
          </div>
        ) : (
          finishedTravels.map((travel, index) => (
            <TravelCard
              key={index}
              travel={travel}
              groupid={groupid}
              onClick={() => navigate(`/group/${groupid}/stats/${travel.tpPk}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Stat;
