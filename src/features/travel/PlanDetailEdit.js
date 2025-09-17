import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelLayout from '../../components/layout/TravelLayout';
import { travelAPI } from '../../services/TravelAPI';
import useStomp from '../../hooks/useStomp';
import { websocketAPI } from '../../services/websocketAPI';
import { GoPlusCircle } from "react-icons/go";
import { getTransactionCategoryIcon } from '../../utils/CategoryIcons';
import { MdCancel } from "react-icons/md";

const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.replace(/-/g, '.');
};

const PlanDetailEdit = () => {
    const navigate = useNavigate();
    const { groupid, travelid } = useParams();
    const [planData, setPlanData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedPlan, setDraggedPlan] = useState(null);
    const [dragOverDay, setDragOverDay] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.userId || 'anonymous';

    // STOMP 연결 - 메시지 핸들러는 함수 선언 아래서 사용해도 괜찮습니다 (호이스팅)
    const { isConnected, error: stompError, publish, publishOp } = useStomp({
        url: 'ws://localhost:8080/ws',
        groupId: groupid,
        travelId: travelid,
        onMessage: handleStompMessage
    });

    // STOMP 메시지 처리 함수
    function handleStompMessage(message) {
        if (!message) return;
        
        console.log('STOMP 메시지 처리:', message);

        switch (message.type) {
            case 'applied':
                // 서버에서 operation이 적용되었다는 알림
                refreshPlanData();
                break;
            case 'saved':
                setIsSaving(false);
                if (message.day !== undefined) {
                    console.log(`Day ${message.day} 저장 완료`);
                } else {
                    console.log('모든 변경사항 저장 완료');
                    navigate(`/group/${groupid}/travel/${travelid}`);
                }
                break;
            case 'presence-join':
                console.log(`사용자 ${message.userId} 입장`);
                break;
            case 'presence-leave':
                console.log(`사용자 ${message.userId} 퇴장`);
                break;
            default:
                console.log('알 수 없는 메시지 타입:', message.type, message);
        }
    }

    const refreshPlanData = useCallback(async () => {
        try {
            const planResponse = await travelAPI.getTravelDetail(travelid, groupid);
            setPlanData(planResponse || []);
        } catch (error) {
            console.error('데이터 새로고침 실패:', error);
        }
    }, [travelid, groupid]);

    // 편집 세션 입장
    useEffect(() => {
        if (isConnected) {
            console.log('편집 세션 입장');
            websocketAPI.joinEditSession(publish, groupid, travelid, currentUserId);
        }
    }, [isConnected, groupid, travelid, currentUserId, publish]);

    // 컴포넌트 언마운트 시 편집 세션 퇴장
    useEffect(() => {
        return () => {
            if (isConnected && publish) {
                console.log('편집 세션 퇴장');
                websocketAPI.leaveEditSession(publish, groupid, travelid, currentUserId);
            }
        };
    }, [isConnected, groupid, travelid, currentUserId, publish]);

    // 초기 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            try {
                const planResponse = await travelAPI.getTravelDetail(travelid, groupid);
                setPlanData(planResponse || []);
                setIsLoading(false);
            } catch (error) {
                console.error('데이터 로드 실패:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [travelid, groupid]);

    // (그룹화/정렬 로직은 동일)...
    const groupByDay = (plans) => {
        const grouped = plans.reduce((acc, plan) => {
            const day = plan.pdDay;
            if (!acc[day]) acc[day] = [];
            acc[day].push(plan);
            return acc;
        }, {});
        Object.keys(grouped).forEach(day => {
            grouped[day].sort((a, b) => {
                const posA = a.position ? parseFloat(a.position) : (a.pdPk || 0);
                const posB = b.position ? parseFloat(b.position) : (b.pdPk || 0);
                if (posA !== posB) return posA - posB;
                const ta = a.opTs ?? 0;
                const tb = b.opTs ?? 0;
                if (ta !== tb) return ta - tb;
                return (a.clientId ?? '').localeCompare(b.clientId ?? '');
            });
        });
        return grouped;
    };

    const onClickAddPlan = () => {
        navigate(`/group/${groupid}/travel/${travelid}/edit/new`);
    };

    // 드래그 핸들러들 (생략된 부분은 기존과 동일)
    const handleDragStart = (e, plan) => {
        setDraggedPlan(plan);
        e.dataTransfer.effectAllowed = 'move';
        try {
            e.dataTransfer.setData('text/plain', plan.crdtId ?? String(plan.pdPk));
        } catch (e) {
            console.debug('drag setData failed:', e);
        }
    };
    const handleDragEnd = () => { setDraggedPlan(null); setDragOverDay(null); setDragOverIndex(null); };
    const handleDragOver = (e, day) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverDay(day); };
    const handleDragOverItemTop = (e, day, index) => { e.preventDefault(); e.stopPropagation(); setDragOverDay(day); setDragOverIndex(index); };
    const handleDragOverItemBottom = (e, day, index) => { e.preventDefault(); e.stopPropagation(); setDragOverDay(day); setDragOverIndex(index + 1); };
    const handleDragLeave = () => { setDragOverDay(null); setDragOverIndex(null); };

    // 드롭 처리
    const handleDrop = (e, targetDay, targetIndex = null) => {
        e.preventDefault();
        if (!draggedPlan) {
            setDragOverDay(null);
            setDragOverIndex(null);
            return;
        }

        // optimistic UI 업데이트 (같음)
        let updatedPlans;
        if (draggedPlan.pdDay === targetDay) {
            const dayPlans = planData.filter(plan => plan.pdDay === targetDay);
            const otherPlans = planData.filter(plan => plan.pdDay !== targetDay);
            const filteredDayPlans = dayPlans.filter(plan => (plan.crdtId || plan.pdPk) !== (draggedPlan.crdtId || draggedPlan.pdPk));
            const insertIndex = targetIndex !== null ? targetIndex : filteredDayPlans.length;
            const newDayPlans = [
                ...filteredDayPlans.slice(0, insertIndex),
                { ...draggedPlan, pdDay: targetDay },
                ...filteredDayPlans.slice(insertIndex)
            ];
            updatedPlans = [...otherPlans, ...newDayPlans];
        } else {
            updatedPlans = planData.map(plan =>
                ((plan.crdtId || plan.pdPk) === (draggedPlan.crdtId || draggedPlan.pdPk))
                    ? { ...plan, pdDay: targetDay }
                    : plan
            );
        }
        setPlanData(updatedPlans);

        // prev/next 계산
        const dayPlansAfter = updatedPlans
            .filter(p => p.pdDay === targetDay)
            .sort((a, b) => {
                const pa = parseFloat(a.position ?? '0'); const pb = parseFloat(b.position ?? '0');
                if (pa !== pb) return pa - pb;
                const ta = a.opTs ?? 0; const tb = b.opTs ?? 0; if (ta !== tb) return ta - tb;
                return (a.clientId ?? '').localeCompare(b.clientId ?? '');
            });

        const keyOf = (p) => p.crdtId ?? String(p.pdPk);
        const insertedKey = keyOf(draggedPlan);
        const insertedIndex = dayPlansAfter.findIndex(p => keyOf(p) === insertedKey);

        const prevCrdtId = insertedIndex > 0 ? (dayPlansAfter[insertedIndex - 1]?.crdtId ?? null) : null;
        const nextCrdtId = (insertedIndex >= 0 && insertedIndex < dayPlansAfter.length - 1)
            ? (dayPlansAfter[insertedIndex + 1]?.crdtId ?? null)
            : null;

        // Op 생성
        const crdtIdToSend = draggedPlan.crdtId ?? String(draggedPlan.pdPk);
        const opCommon = {
            opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            clientId: currentUserId,
            opTs: Date.now(),
        };

        let op;
        if (draggedPlan.pdDay === targetDay) {
            op = { ...opCommon, type: 'move', day: targetDay, payload: { crdtId: crdtIdToSend, prevCrdtId, nextCrdtId } };
        } else {
            op = { ...opCommon, type: 'moveDay', day: draggedPlan.pdDay, payload: { crdtId: crdtIdToSend, prevCrdtId, nextCrdtId, newDay: targetDay } };
        }

        console.log('Op 전송:', op);

        // 전송: publishOp가 true/false 반환하도록 useStomp에서 변경됨
        if (publishOp) {
            const success = publishOp(op);
            if (!success) {
                console.error('Op 전송 실패, 서버에 반영되지 않았을 수 있음. 새로고침 실행.');
                refreshPlanData(); // 롤백 대체
            }
        } else {
            console.error('publishOp 함수가 없음');
            refreshPlanData();
        }

        // 상태 클리어
        setDraggedPlan(null);
        setDragOverDay(null);
        setDragOverIndex(null);
    };

    // 삭제 처리
    const handleDeletePlan = (plan) => {
        if (!window.confirm('이 일정을 삭제하시겠습니까?')) return;

        const key = plan.crdtId ?? String(plan.pdPk);
        const updatedPlans = planData.filter(p => (p.crdtId ?? String(p.pdPk)) !== key);
        setPlanData(updatedPlans);

        const op = {
            opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            clientId: currentUserId,
            opTs: Date.now(),
            type: 'delete',
            day: plan.pdDay,
            payload: { crdtId: key }
        };

        console.log('삭제 Op 전송:', op);
        if (publishOp) {
            const success = publishOp(op);
            if (!success) {
                console.error('삭제 Op 전송 실패, 새로고침 실행');
                refreshPlanData();
            }
        } else {
            console.error('publishOp 함수가 없음');
            refreshPlanData();
        }
    };

    // 저장 처리
    const handleSave = () => {
        if (!isConnected) {
            alert('연결이 끊어진 상태입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        setIsSaving(true);
        console.log('저장 요청');

        websocketAPI.publishSaveCompleted(publish, groupid, travelid, currentUserId);
    };

    if (isLoading) return <div className="p-4">일정을 불러오는 중입니다...</div>;
    const groupedPlans = groupByDay(planData);

    return (
        <TravelLayout title="여행 일정 편집">
            {({ travelDays, formatDate, travelInfo }) => (
                <>
                    <div className="flex items-center justify-between py-2 text-xs">
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                                {isConnected ? '실시간 동기화 중' : '연결 끊김'}
                            </span>
                            {isSaving && <span className="text-blue-600">저장 중...</span>}
                        </div>
                        {stompError && <span className="text-red-500 text-xs">연결 오류</span>}
                        <button className="text-gray-500 text-sm text-right m-0 disabled:opacity-50" onClick={handleSave} disabled={!isConnected || isSaving}>
                            {isSaving ? '저장 중...' : '저장'}
                        </button>
                    </div>

                    <div className='min-h-full overflow-y-scroll'>
                        {Array.from({ length: travelDays }, (_, index) => index + 1).map((day) => (
                            <div key={day} className="space-y-3 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <h2 className="text-lg font-bold text-gray-800">Day {day} </h2>
                                        <span className="text-sm text-gray-600 ml-2">| {formatDate(parseInt(day))}</span>
                                    </div>
                                </div>

                                <div
                                    className={`space-y-2 min-h-[100px] p-2 transition-colors ${dragOverDay === day ? 'bg-blue-100 border-b-4 border-blue' : ''}`}
                                    onDragOver={(e) => handleDragOver(e, day)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, day)}
                                >
                                    {groupedPlans[day] && groupedPlans[day].length > 0 ? (
                                        groupedPlans[day].map((plan, index) => (
                                            <div key={plan.crdtId ?? plan.pdPk ?? index}>
                                                {dragOverDay === day && dragOverIndex === index && (
                                                    <div className="h-1 bg-blue-500 rounded-full mx-2 mb-2 shadow-lg" />
                                                )}

                                                <div className="flex items-center w-full">
                                                    <div
                                                        className="bg-white rounded-lg p-3 shadow-sm border w-full cursor-move transition-all hover:shadow-md"
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, plan)}
                                                        onDragEnd={handleDragEnd}
                                                    >
                                                        <div className="h-3 -mt-3 -mx-3 cursor-move" onDragOver={(e) => handleDragOverItemTop(e, day, index)} onDrop={(e) => handleDrop(e, day, index)} />

                                                        <div className="flex justify-between items-center">
                                                            <div className="flex-1">
                                                                <div className="font-semibold text-gray-800">{plan.pdPlace}</div>
                                                                <div className="text-sm text-gray-500 mt-1">{plan.pdAddress}</div>
                                                                {plan.crdtId && <div className="text-xs text-gray-400 mt-1">ID: {plan.crdtId}</div>}
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-semibold text-gray-800">{plan.pdCost?.toLocaleString()}원</div>
                                                                <div className="text-sm text-gray-500 mt-1 flex items-center justify-end">{getTransactionCategoryIcon(plan.tcCode)}</div>
                                                            </div>
                                                            <div className="flex flex-col ml-3">
                                                                <button onClick={() => handleDeletePlan(plan)} className="text-gray-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer" title="삭제">
                                                                    <MdCancel className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="h-3 -mb-3 -mx-3 cursor-move" onDragOver={(e) => handleDragOverItemBottom(e, day, index)} onDrop={(e) => handleDrop(e, day, index + 1)} />
                                                    </div>
                                                </div>

                                                {dragOverDay === day && dragOverIndex === index + 1 && (
                                                    <div className="h-1 bg-blue-500 rounded-full mx-2 mt-2 shadow-lg" />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-lg p-4 text-center text-gray-500 text-xs min-h-[60px] flex items-center justify-center">
                                            {dragOverDay === day ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="h-1 bg-blue-500 rounded-full w-32 mb-2 shadow-lg"></div>
                                                    <div>여기에 일정을 놓으세요</div>
                                                </div>
                                            ) : (
                                                '일정이 비어있습니다.'
                                            )}
                                        </div>
                                    )}

                                    {dragOverDay === day && dragOverIndex === (groupedPlans[day]?.length || 0) && (
                                        <div className="h-1 bg-blue-500 rounded-full mx-2 mt-2 shadow-lg"></div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2 w-full">
                                    <button className="flex items-center justify-center text-gray-500 text-sm m-0 w-full" onClick={onClickAddPlan}>
                                        <GoPlusCircle className="mr-2"/>
                                        일정 추가하기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </TravelLayout>
    );
};

export default PlanDetailEdit;
