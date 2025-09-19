import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelLayout from '../../components/layout/TravelLayout';
import EmptyBear from '../../components/common/EmptyBear';
import { TravelAPI } from '../../services/TravelAPI';
import { getTransactionCategoryIcon } from '../../utils/CategoryIcons';

const PlanDetail = () => {
    const navigate = useNavigate();
    const { groupid, travelid } = useParams();
    const [planData, setPlanData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 일정만 가져오기 (여행 정보는 TravelLayout에서 처리)
                const planResponse = await TravelAPI.getTravelDetail(travelid, groupid);
                setPlanData(planResponse);
                setIsLoading(false);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                const errorData = error.response?.data || error;
                navigate('/error', { 
                    state: { 
                        error: errorData,
                        from: `/group/${groupid}/travel`
                    } 
                });
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

    // 이제 TravelLayout에서 travelDays와 formatDate를 받아옴

    if (isLoading) {
        return <div className="p-4">일정을 불러오는 중입니다...</div>;
    }

    const groupedPlans = groupByDay(planData);
    const onClickEdit = () => {
        navigate(`/group/${groupid}/travel/${travelid}/edit`);
    }

    return (
        <TravelLayout title="여행 일정">
            {({ travelDays, formatDate, travelInfo }) => (
                planData.length > 0 ? (
                <div>
                    {/* 일정이 있을 때 - 편집 버튼과 일별 일정 표시 */}
                    <button className="w-full text-gray-500 text-sm text-right m-0" onClick={onClickEdit}>편집</button>
                    {Array.from({ length: travelDays }, (_, index) => index + 1).map((day) => (
                        <div key={day} className="space-y-3 pb-4">
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
                                        <div key={plan.pdPk || index} className="bg-white rounded-lg p-3 shadow-sm border w-full">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800">{plan.pdPlace}</div>
                                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{plan.pdAddress}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-800">{plan.pdCost?.toLocaleString()}원</div>
                                                    <div className="text-sm text-gray-500 mt-1 flex items-center justify-end">
                                                        {getTransactionCategoryIcon(plan.tcCode)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg p-4 text-center text-gray-500 text-xs">
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
                </div>
            ) : (
                /* 일정이 아무것도 없을 때 - 빈 상태 표시 */
                <EmptyBear title="앗! 일정이 없어요" description="새로운 여행 일정을 추가해보세요!" onClick={onClickEdit} buttonText="첫 일정 추가하기" />
            ))}
        </TravelLayout>
    );
};

export default PlanDetail;