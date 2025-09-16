import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CiSquarePlus } from "react-icons/ci";
import { travelAPI } from '../../services/TravelAPI.js';
import TravelCard from '../../components/common/TravelCard';
import EmptyBear from '../../components/common/EmptyBear';

const Travel = () => {
    const navigate = useNavigate();
    const [travels, setTravels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('0'); // 0: 전체, 1: 여행 전, 2: 여행 중, 3: 여행 완료
    const { groupid } = useParams();

    useEffect(() => {
        const fetchTravels = async () => {
            try {
                setIsLoading(true);
                // 상태 코드를 백엔드 enum에 맞게 변환
                const statusMap = {
                    '0': null,      // 전체
                    '1': 'BEFORE',  // 여행 전
                    '2': 'ONGOING', // 여행 중
                    '3': 'FINISH'   // 여행 완료
                };
                
                const status = statusMap[selectedStatus];
                const response = await travelAPI.getTravelList('', groupid, status);
                setTravels(response);
            } catch (error) {
                console.error('여행 목록 로드 실패:', error);
                const errorData = error.response?.data || error;
                navigate('/error', { 
                    state: { 
                        error: errorData,
                        from: `/group/${groupid}/travel`
                    } 
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchTravels();
    }, [groupid, selectedStatus]);

    const onClickNew = () => {
        navigate(`/group/${groupid}/travel/new`);
    }

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    }

    const handleTravelClick = (travel) => {
        navigate(`/group/${groupid}/travel/${travel.pk}`);
    };

    return (
        <>
        <div className='flex items-center justify-between'>
            <select className='bg-white rounded-sm p-2 focus:outline-none focus:underline'
            value={selectedStatus}
            onChange={handleStatusChange}>
                <option value="0">전체</option>
                <option value="1">여행 전</option>
                <option value="2">여행 중</option>
                <option value="3">여행 완료</option>
            </select>
            <button className='bg-white rounded-sm px-2 focus:outline-none focus:underline'>
                <CiSquarePlus className='h-6 w-6' onClick={() => navigate(`/group/${groupid}/travel/new`)}/>
            </button>
        </div>
        {isLoading ? (
            <p>여행 목록을 불러오는 중입니다...</p>
        ) : (
            <div>
                <div>
                    {travels && travels.length > 0 ? (
                        travels.map((travel, index) => (
                            <TravelCard key={travel.pk || `travel-${index}`} travel={travel} groupid={groupid} onClick={() => handleTravelClick(travel)} />
                        ))
                    ) : (
                        selectedStatus === '0' ? (
                            <EmptyBear title="앗! 여행 계획이 없어요" description="새로운 여행 계획을 추가해보세요!" onClick={onClickNew} buttonText="첫 여행 계획 추가하기" />
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg font-medium mb-2">
                                    {selectedStatus === '1' && '여행 전인 여행이 없어요'}
                                    {selectedStatus === '2' && '여행 중인 여행이 없어요'}
                                    {selectedStatus === '3' && '여행 완료된 여행이 없어요'}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    다른 상태를 선택해보세요
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        )}
        </>
    );
};

export default Travel;