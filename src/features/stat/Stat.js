import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelCard from '../../components/common/TravelCard';
import { statAPI } from '../../services/StatAPI';
import emptySol from '../../assets/images/empty_sol.svg';
import TravelStatsView from './components/TravelStatsView';

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
  const [finishedTravels, setFinishedTravels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTravel, setSelectedTravel] = useState(null);

  // 데이터 변환
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

  // URL에서 travelid가 있으면 해당 여행 찾기
  useEffect(() => {
    if (travelid && finishedTravels.length > 0) {
      const travel = finishedTravels.find(t => t.tpPk === parseInt(travelid));
      if (travel) {
        setSelectedTravel(travel);
      }
    }
  }, [travelid, finishedTravels]);

  if (selectedTravel) {
    return <TravelStatsView travel={{ ...selectedTravel, groupid }} />;
  }

  return (
    <div className="h-full overflow-y-auto">
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
