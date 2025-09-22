import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CiSquarePlus } from "react-icons/ci";
import { TravelAPI } from '../../services/TravelAPI.js';
import TravelCard from '../../components/common/TravelCard';
import EmptyBear from '../../components/common/EmptyBear';
import Loading from '../../components/common/Loading';

const Travel = () => {
    const navigate = useNavigate();
    const [travels, setTravels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('0'); 
    const [showDropdown, setShowDropdown] = useState(false);
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
                const response = await TravelAPI.getTravelList('', groupid, status);
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

    const statusOptions = [
        { value: '0', label: '전체' },
        { value: '1', label: '여행 전' },
        { value: '2', label: '여행 중' },
        { value: '3', label: '여행 완료' }
    ];

    const getStatusText = () => {
        const option = statusOptions.find(opt => opt.value === selectedStatus);
        return option ? option.label : '전체';
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setShowDropdown(false);
    }

    const handleTravelClick = (travel) => {
        navigate(`/group/${groupid}/travel/${travel.pk}`);
    };

    // 필터 및 추가 버튼 컴포넌트
    const FilterAndAddButtons = () => (
        <div className='flex items-center justify-between mb-4 flex-shrink-0'>
            <div className="relative">
                <div
                    className="inline-flex items-center cursor-pointer px-2 pl-3 py-1 w-20 flex flex-row justify-between bg-white rounded-sm"
                    onClick={() => setShowDropdown(!showDropdown)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            setShowDropdown(!showDropdown);
                        }
                    }}
                    aria-expanded={showDropdown}
                    aria-haspopup="listbox"
                >
                    <span className="text-sm text-gray-2">{getStatusText()}</span>
                    <svg
                        className={`w-3 h-3 text-gray-2 transition-transform ml-1 ${
                            showDropdown ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>

                {showDropdown && (
                    <div className="absolute z-10 bg-white border border-gray-5 rounded-md shadow-lg mt-1 min-w-fit w-20">
                        {statusOptions.map(option => (
                            <div
                                key={option.value}
                                className={`px-2 pl-3 py-2 text-sm cursor-pointer text-left w-20 ${
                                    selectedStatus === option.value
                                        ? 'bg-main text-white'
                                        : 'text-gray-2 hover:bg-gray-6'
                                }`}
                                role="option"
                                tabIndex={0}
                                aria-selected={selectedStatus === option.value}
                                onClick={() => handleStatusChange(option.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleStatusChange(option.value);
                                    }
                                }}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button className='bg-white rounded-sm px-2 focus:outline-none focus:underline'>
                <CiSquarePlus className='h-6 w-6 text-gray-2' onClick={() => navigate(`/group/${groupid}/travel/new`)}/>
            </button>
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            {travels && travels.length > 0 && <FilterAndAddButtons />}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loading />
                </div>
            ) : (
                <div className="h-[calc(100vh-350px)] overflow-y-auto mb-20">
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
        </div>
    );
};

export default Travel;