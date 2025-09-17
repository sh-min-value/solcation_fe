import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TravelLayout from '../../components/layout/TravelLayout';
import useStomp from '../../hooks/useStomp';
import { websocketAPI } from '../../services/WebsocketAPI'; 
import { GoPlusCircle } from "react-icons/go";
import { getTransactionCategoryIcon } from '../../utils/CategoryIcons';
import { MdCancel } from "react-icons/md";
import SelectPurpose from '../../components/common/SelectPurpose';

const PlanDetailEdit = () => {
    const navigate = useNavigate();
    const { groupid, travelid } = useParams();
    const [planData, setPlanData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [draggedPlan, setDraggedPlan] = useState(null);
    const [dragOverDay, setDragOverDay] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [editFormData, setEditFormData] = useState({
        cost: '',
        tcCode: 'FOOD'
    });
    const hasJoinedRef = useRef(false); 

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.userId || 'anonymous';

    const { isConnected, error: stompError, publish, publishOp, refreshData } = useStomp({
        url: 'ws://localhost:8080/ws',
        groupId: groupid,
        travelId: travelid,
        onMessage: handleStompMessage,
        onRefreshData: () => {
            if (isConnected && publish && groupid && travelid && currentUserId) {
                websocketAPI.joinEditSession(publish, groupid, travelid, currentUserId);
            }
        },
        autoJoin: true
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
                    navigate(`/group/${groupid}/travel/${travelid}`);
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
            case 'join-response':
                console.log(`스냅샷`, message.snapshot);
                setPlanData(message.snapshot);
                setIsLoading(false); // 로딩 상태 해제
                    break;
                default:
                console.log('알 수 없는 메시지 타입:', message.type, message);
        }
    }

    const refreshPlanData = useCallback(() => {
        refreshData();
    }, [refreshData]);

    // 로딩 상태 해제 (연결되면)
    useEffect(() => {
        if (isConnected) {
            setIsLoading(false);
        }
    }, [isConnected]);

    // 스냅샷 데이터를 플랫한 배열로 변환
    const flattenSnapshotData = (snapshot) => {
        if (!snapshot) return [];
        
        const allPlans = [];
        Object.keys(snapshot).forEach(day => {
            const dayData = snapshot[day];
            if (dayData && dayData.items && Array.isArray(dayData.items)) {
                dayData.items.forEach(plan => {
                    if(!plan.tombstone){
                        allPlans.push(plan);
                    }
                });
            }
        });
        return allPlans;
    };

    // 그룹화/정렬 로직
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

    // 일정 수정 핸들러 (꾹 누르기)
    const handleLongPress = (plan) => {
        setEditingPlan(plan);
        setEditFormData({
            cost: plan.pdCost || 0,
            tcCode: plan.tcCode || 'FOOD'
        });
    };

    // 수정 모달 닫기
    const handleCloseEditModal = () => {
        setEditingPlan(null);
        setEditFormData({ cost: '', tcCode: 'FOOD' });
    };

    // 수정 저장
    const handleSaveEdit = () => {
        if (!editingPlan || !isConnected || !publishOp) return;

        const crdtId = editingPlan.crdtId ?? String(editingPlan.pdPk);
        const op = {
            opId: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
            clientId: currentUserId,
            opTs: Date.now(),
            type: 'update',
            day: editingPlan.pdDay,
            payload: {
                crdtId: crdtId,
                pdCost: parseInt(editFormData.cost) || 0,
                tcCode: editFormData.tcCode
            }
        };

        console.log('수정 Op 전송:', op);
        const success = publishOp(op);
        if (success) {
            handleCloseEditModal();
        } else {
            console.error('수정 Op 전송 실패');
        }
    };

    // 드래그 핸들러들
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

        // optimistic UI 업데이트
        const isSnapshotData = planData && typeof planData === 'object' && !Array.isArray(planData) && planData[1]?.items;
        
        if (isSnapshotData) {
            // 스냅샷 형태인 경우
            const updatedSnapshot = { ...planData };
            
            // 기존 위치에서 제거
            Object.keys(updatedSnapshot).forEach(day => {
                if (updatedSnapshot[day]?.items) {
                    updatedSnapshot[day].items = updatedSnapshot[day].items.filter(
                        plan => (plan.crdtId || plan.pdPk) !== (draggedPlan.crdtId || draggedPlan.pdPk)
                    );
                }
            });
            
            // 새 위치에 추가
            if (!updatedSnapshot[targetDay]) {
                updatedSnapshot[targetDay] = { items: [], lastStreamId: "0-0" };
            }
            
            const targetDayItems = updatedSnapshot[targetDay].items || [];
            const insertIndex = targetIndex !== null ? targetIndex : targetDayItems.length;
            const newItem = { ...draggedPlan, pdDay: targetDay };
            
            updatedSnapshot[targetDay].items = [
                ...targetDayItems.slice(0, insertIndex),
                newItem,
                ...targetDayItems.slice(insertIndex)
            ];
            
            setPlanData(updatedSnapshot);
        } else {
            // 배열 형태인 경우 (기존 로직)
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
        }

        // prev/next 계산을 위한 플랫한 데이터
        const flatData = isSnapshotData ? flattenSnapshotData(planData) : planData;
        const dayPlansAfter = flatData
            .filter(p => p.pdDay === targetDay && (p.crdtId ?? String(p.pdPk)) !== (draggedPlan.crdtId ?? String(draggedPlan.pdPk)))
            .sort((a, b) => {
                const pa = parseFloat(a.position ?? '0'); const pb = parseFloat(b.position ?? '0');
                if (pa !== pb) return pa - pb;
                const ta = a.opTs ?? 0; const tb = b.opTs ?? 0; if (ta !== tb) return ta - tb;
                return (a.clientId ?? '').localeCompare(b.clientId ?? '');
            });

        // targetIndex를 기준으로 prev/next 계산
        const prevCrdtId = targetIndex > 0 ? (dayPlansAfter[targetIndex - 1]?.crdtId ?? null) : null;
        const nextCrdtId = targetIndex < dayPlansAfter.length ? (dayPlansAfter[targetIndex]?.crdtId ?? null) : null;

        console.log('prev/next 계산:', { 
            targetIndex, 
            dayPlansAfterLength: dayPlansAfter.length,
            prevCrdtId, 
            nextCrdtId,
            dayPlansAfter: dayPlansAfter.map(p => ({ place: p.pdPlace, crdtId: p.crdtId }))
        });

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
        const isSnapshotData = planData && typeof planData === 'object' && !Array.isArray(planData) && planData[1]?.items;
        
        if (isSnapshotData) {
            // 스냅샷 형태인 경우
            const updatedSnapshot = { ...planData };
            Object.keys(updatedSnapshot).forEach(day => {
                if (updatedSnapshot[day]?.items) {
                    updatedSnapshot[day].items = updatedSnapshot[day].items.filter(
                        p => (p.crdtId ?? String(p.pdPk)) !== key
                    );
                }
            });
            setPlanData(updatedSnapshot);
        } else {
            // 배열 형태인 경우
            const updatedPlans = planData.filter(p => (p.crdtId ?? String(p.pdPk)) !== key);
            setPlanData(updatedPlans);
        }

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
    
    // planData가 스냅샷 형태인지 배열 형태인지 확인
    const isSnapshotData = planData && typeof planData === 'object' && !Array.isArray(planData) && planData[1]?.items;
    const displayData = isSnapshotData ? flattenSnapshotData(planData) : planData;
    const groupedPlans = groupByDay(displayData);

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
                                                        role="button"
                                                        tabIndex={0}
                                                        onDragStart={(e) => handleDragStart(e, plan)}
                                                        onDragEnd={handleDragEnd}
                                                    >
                                                        <div className="h-3 -mt-3 -mx-3 cursor-move" onDragOver={(e) => handleDragOverItemTop(e, day, index)} onDrop={(e) => handleDrop(e, day, index)} />

                                                        <div className="flex justify-between items-center">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800">{plan.pdPlace}</div>
                                                                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">{plan.pdAddress}</div>                                                                
                                                </div>
                                                             <div 
                                                                 className="text-right"
                                                                 role="button"
                                                                 tabIndex={0}
                                                                 onMouseDown={() => handleLongPress(plan)}
                                                                 onTouchStart={() => handleLongPress(plan)}
                                                                 onKeyDown={(e) => {
                                                                     if (e.key === 'Enter' || e.key === ' ') {
                                                                         e.preventDefault();
                                                                         handleLongPress(plan);
                                                                     }
                                                                 }}
                                                             >
                                                    <div className="font-semibold text-gray-800">{plan.pdCost?.toLocaleString()}원</div>
                                                                <div className="text-sm text-gray-500 mt-1 flex items-center justify-end">
                                                                    {getTransactionCategoryIcon(plan.tcCode)}
                                                                </div>
                                                            </div>
                                                             <div className="flex flex-col ml-3">
                                                                 <button 
                                                                     onClick={(e) => {
                                                                         e.stopPropagation();
                                                                         handleDeletePlan(plan);
                                                                     }} 
                                                                     className="text-gray-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer" 
                                                                     title="삭제"
                                                                 >
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

                    {/* 수정 모달 */}
                    {editingPlan && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-2xl p-6 w-80 mx-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">일정 수정</h3>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="pdPlace" className="block text-sm font-medium text-gray-700 mb-2">장소</label>
                                        <div id="pdPlace" className="text-gray-600">{editingPlan.pdPlace}</div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">비용</label>
                                        <input
                                            type="number"
                                            id="cost"
                                            value={editFormData.cost}
                                            onChange={(e) => setEditFormData(prev => ({ ...prev, cost: e.target.value }))}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="금액을 입력하세요"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="categoryCode" className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                                        <SelectPurpose
                                            id='categoryCode'
                                            value={editFormData.tcCode}
                                            onChange={(value) => setEditFormData(prev => ({ ...prev, tcCode: value }))}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex space-x-3 mt-6">
                                    <button
                                        onClick={handleCloseEditModal}
                                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 py-3 bg-light-blue text-third rounded-lg font-medium hover:bg-blue shadow-lg"
                                    >
                                        저장
                                    </button>
                                </div>
                    </div>
                </div>
                    )}
                </>
            )}
        </TravelLayout>
    );
};

export default PlanDetailEdit;
