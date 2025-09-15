import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { travelAPI } from '../../services/TravelAPI';
import useStomp from '../../hooks/useStomp';
import { GoPlusCircle } from 'react-icons/go';

const PlanDetailEdit = () => {
    const navigate = useNavigate();
    const { groupid, travelid } = useParams();
    const [planData, setPlanData] = useState([]);
    const [travelInfo, setTravelInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const currentUserId = JSON.parse(localStorage.getItem('user')).userId;
    console.log('currentUserId', currentUserId);

    // STOMP 연결
    const { isConnected, error: stompError, publish, publishOp } = useStomp({
        url: 'ws://localhost:8080/ws',
        groupId: groupid,
        travelId: travelid,
        onMessage: (message) => {
            console.log('STOMP 메시지 수신:', message);
            handleStompMessage(message);
        }
    });

    useEffect(() => {
        if (isConnected) {
            console.log('isConnected:', isConnected, 'groupid:', groupid, 'travelid:', travelid);
            publish({
                destination: `/app/group/${groupid}/travel/${travelid}/edit/join`,
                body: { userId: currentUserId} 
            });
        }
    }, [isConnected, groupid, travelid, publish, currentUserId]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                // 여행 정보와 일정을 동시에 가져오기
                const [travelResponse, planResponse] = await Promise.all([
                    travelAPI.getTravel(travelid, groupid),
                    travelAPI.getTravelDetail(travelid, groupid)
                ]);
                
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

    // STOMP 메시지 처리 함수
    const handleStompMessage = useCallback((message) => {
        if (!message) return;
        
        switch (message.type) {
            case 'PLAN_ADDED':
            case 'PLAN_UPDATED':
            case 'PLAN_DELETED': {
                // 일정 변경 시 데이터 새로고침
                const refreshData = async () => {
                    try {
                        const response = await travelAPI.getTravelDetail(travelid, groupid);
                        setPlanData(response);
                    } catch (error) {
                        console.error('데이터 새로고침 실패:', error);
                    }
                };
                refreshData();
                break;
            }
            case 'USER_JOINED':
                console.log('사용자 참여:', message.user);
                break;
            case 'USER_LEFT':
                console.log('사용자 나감:', message.user);
                break;
            default:
                console.log('알 수 없는 메시지 타입:', message.type);
        }
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
    const onClickSave = () => {
        if (isConnected) {
            console.log('isConnected:', isConnected, 'groupid:', groupid, 'travelid:', travelid);
            publish({
                destination: `/app/group/${groupid}/travel/${travelid}/edit/save`,
                body: { clientId: currentUserId }
            });
        }
        navigate(`/group/${groupid}/travel/${travelid}`);
    }
    const onClickAddPlan = () => {
        navigate(`/group/${groupid}/travel/${travelid}/edit/add`);
    }
    return (
        <div>
            {/* STOMP 연결 상태 표시 */}
            <div className="flex items-center justify-between p-2 text-xs">
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                        {isConnected ? '실시간 동기화 중' : '연결 끊김'}
                    </span>
                </div>
                {stompError && (
                    <span className="text-red-500 text-xs">연결 오류</span>
                )}
                <button className="text-gray-500 text-sm text-right m-0" onClick={onClickSave}>저장</button>
            </div>

            {planData.length > 0 && (
                <>
                    {/* 일정이 있을 때 - 편집 버튼과 일별 일정 표시 */}
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
                                                        <span className="mr-1">🏠</span>
                                                        카테고리
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

                            <div className="flex items-center justify-betwee bg-gray-100 rounded-lg p-2 w-full">
                                <button className="flex items-center justify-center text-gray-500 text-sm m-0 w-full" onClick={onClickAddPlan}>
                                    <GoPlusCircle className="mr-2"/>
                                    일정 추가하기
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default PlanDetailEdit;