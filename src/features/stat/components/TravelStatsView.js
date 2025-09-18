import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import TotalSpentSection from './TotalSpentSection';
import ComparePlanActual from './ComparePlanActual';
import ComparePerPersonSection from './ComparePerPersonSection';
import CategoryCompareSection from './CategoryCompareSection';
import InsightSection from './InsightSection';
import { statAPI } from '../../../services/StatAPI';

const TravelStatsView = ({ travel }) => {
  const navigate = useNavigate();
  const { groupid } = useParams();
  const [travelList, setTravelList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 완료한 여행 리스트 가져오기
  useEffect(() => {
    const fetchTravelList = async () => {
      if (!groupid) return;

      try {
        const response = await statAPI.getFinishedTravels(groupid);
        const travels = Array.isArray(response)
          ? response
          : response?.data || [];
        setTravelList(travels);

        const index = travels.findIndex(t => t.tpPk === travel.tpPk);
        setCurrentIndex(index >= 0 ? index : 0);
      } catch (error) {
        setTravelList([]);
      }
    };

    fetchTravelList();
  }, [groupid, travel?.tpPk]);

  const handlePreviousTravel = () => {
    if (currentIndex > 0) {
      const prevTravel = travelList[currentIndex - 1];
      navigate(`/group/${groupid}/stats/${prevTravel.tpPk}`);
    }
  };

  const handleNextTravel = () => {
    if (currentIndex < travelList.length - 1) {
      const nextTravel = travelList[currentIndex + 1];
      navigate(`/group/${groupid}/stats/${nextTravel.tpPk}`);
    }
  };

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < travelList.length - 1;

  const formatDate = dateString => {
    return dateString?.replace(/-/g, '.').substring(5) || '';
  };

  const ChevronButton = ({ direction, onClick }) => (
    <button
      onClick={onClick}
      className={`absolute ${direction}-0 top-1/2 transform -translate-y-1/2 text-blue hover:text-third transition-colors`}
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
          d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  );

  return (
    <div
      className="pt-0 px-4 pb-4 overflow-y-auto bg-white relative"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <div className="relative text-center mb-6">
        {hasPrevious && (
          <ChevronButton direction="left" onClick={handlePreviousTravel} />
        )}

        <div className="px-8">
          <h1 className="text-xl font-bold text-third mb-1">
            {travel?.tpTitle || travel?.title || '여행'}
          </h1>
          <p className="text-sm text-blue">
            {formatDate(travel?.tpStart || travel?.startDate)} ~{' '}
            {formatDate(travel?.tpEnd || travel?.endDate)}
          </p>
        </div>

        {hasNext && (
          <ChevronButton direction="right" onClick={handleNextTravel} />
        )}
      </div>

      <TotalSpentSection travel={travel} groupid={groupid} />

      <div className="my-5">
        <hr className="border-gray-5" />
      </div>

      <ComparePlanActual travel={travel} groupid={groupid} />

      <div className="my-5">
        <hr className="border-gray-5" />
      </div>

      <ComparePerPersonSection travel={travel} groupid={groupid} />

      <div className="my-5">
        <hr className="border-gray-5" />
      </div>

      <CategoryCompareSection travel={travel} groupid={groupid} />
      <InsightSection groupid={groupid} travelId={travel?.tpPk} />
    </div>
  );
};

TravelStatsView.propTypes = {
  travel: PropTypes.shape({
    tpTitle: PropTypes.string,
    title: PropTypes.string,
    tpStart: PropTypes.string,
    startDate: PropTypes.string,
    tpEnd: PropTypes.string,
    endDate: PropTypes.string,
    groupid: PropTypes.string,
    tpPk: PropTypes.number,
  }),
};

export default TravelStatsView;
