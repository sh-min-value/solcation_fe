import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CiSquarePlus } from "react-icons/ci";
import { travelAPI } from '../../services/TravelAPI.js';
import TravelCard from '../../components/common/TravelCard';

const Travel = () => {
    const navigate = useNavigate();
    const [travels, setTravels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { groupid } = useParams();

    useEffect(() => {
        const fetchTravels = async () => {
            try {
                const response = await travelAPI.getTravelList('', groupid);
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
    }, [groupid]);

    return (
        <>
        <div className='flex items-center justify-between'>
            <select className='w-16 bg-white rounded-sm p-2 focus:outline-none focus:underline'>
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
                            <TravelCard key={travel.pk || `travel-${index}`} travel={travel} groupid={groupid} />
                        ))
                    ) : (
                        <p>여행 목록이 비어있습니다.</p>
                    )}
                </div>
            </div>
        )}
        </>
    );
};

export default Travel;