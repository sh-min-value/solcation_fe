import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { travelAPI } from '../../services/TravelAPI';
import plan_empty from '../../assets/images/empty_sol.svg';
import { getTransactionCategoryIcon } from '../../utils/CategoryIcons';

const PlanDetail = () => {
    const navigate = useNavigate();
    const { groupid, travelid } = useParams();
    const [planData, setPlanData] = useState([]);
    const [travelInfo, setTravelInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 여행 정보와 일정을 동시에 가져오기
                const [travelResponse, planResponse] = await Promise.all([
                    travelAPI.getTravel(travelid, groupid),
                    travelAPI.getTravelDetail(travelid, groupid)
                ]);

                console.log('planResponse:', planResponse);
                
                setTravelInfo(travelResponse);
                setPlanData(planResponse);
                setIsLoading(false);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [travelid, groupid]);

    // 일별로 그룹화
    const groupByDay = (plans) => {
        return plans.reduce((acc, plan) => {
            const day = plan.pdDay;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(plan);
            return acc;
        }, {});
    };

    // 일별 소계 계산
    const calculateDayTotal = (dayPlans) => {
        return dayPlans.reduce((total, plan) => total + (plan.pdCost || 0), 0);
    };

    // 여행 일수 계산 (시작일과 종료일 차이)
    const getTravelDays = () => {
        if (!travelInfo) return 1;
        
        const startDate = new Date(travelInfo.startDate);
        const endDate = new Date(travelInfo.endDate);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        return diffDays > 0 ? diffDays : 1;
    };

    // 날짜 포맷팅 (여행 시작일 기준)
    const formatDate = (day) => {
        if (!travelInfo) return '';
        
        const startDate = new Date(travelInfo.startDate);
        const targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + day - 1);
        
        const month = targetDate.getMonth() + 1;
        const date = targetDate.getDate();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[targetDate.getDay()];
        
        return `${month}.${date}(${dayName})`;
    };

    if (isLoading) {
        return <div className="p-4">일정을 불러오는 중입니다...</div>;
    }

    const groupedPlans = groupByDay(planData);
    const travelDays = getTravelDays();
    const onClickEdit = () => {
        navigate(`/group/${groupid}/travel/${travelid}/edit`);
    }

    return (
        <div>
            {planData.length > 0 ? (
                <>
                    {/* 일정이 있을 때 - 편집 버튼과 일별 일정 표시 */}
                    <button className="w-full text-gray-500 text-sm text-right m-0" onClick={onClickEdit}>편집</button>
                    {Array.from({ length: travelDays }, (_, index) => index + 1).map((day) => (
                        <div key={day} className="space-y-3 p-4">
                            {/* Day Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-lg font-bold text-gray-800">Day {day}</h2>
                                    <span className="text-sm text-gray-600">| {formatDate(parseInt(day))}</span>
                                </div>
                            </div>

                            {/* Places */}
                            <div className="space-y-2">
                                {groupedPlans[day] && groupedPlans[day].length > 0 ? (
                                    groupedPlans[day].map((plan, index) => (
                                        <div key={plan.pdPk || index} className="bg-white rounded-lg p-3 shadow-sm border">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800">{plan.pdPlace}</div>
                                                    <div className="text-sm text-gray-500 mt-1">{plan.pdAddress}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-800">{plan.pdCost?.toLocaleString()}원</div>
                                                    <div className="text-sm text-gray-500 mt-1 flex items-center">
                                                        {getTransactionCategoryIcon(plan.category)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-xs">
                                        일정이 비어있습니다. 
                                    </div>
                                )}
                            </div>

                            {/* Daily Subtotal */}
                            <div className="bg-amber-50 rounded-lg p-2 flex justify-between items-center">
                                <span className="font-semibold text-gray-800 text-xs">
                                    소계 : {calculateDayTotal(groupedPlans[day] || []).toLocaleString()}원
                                </span>
                                <span className="text-gray-500">▼</span>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                /* 일정이 아무것도 없을 때 - 빈 상태 표시 */
                <div className="p-4">
                    <div className="text-center py-12">
                        <img src={plan_empty} alt="plan" className="w-60 h-60 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">앗! 아직 일정이 없어요</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            새로운 여행 일정을 추가해보세요!
                        </p>
                        <button className="bg-light-blue text-main font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors" onClick={onClickEdit}>
                            첫 일정 추가하기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanDetail;