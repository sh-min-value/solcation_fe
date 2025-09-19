import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BiSearch } from 'react-icons/bi';
import { IoLocationSharp } from "react-icons/io5";
import Header from '../../components/common/Header';
import SelectPurpose from '../../components/common/SelectPurpose';
import MapComponent from '../../components/common/MapComponent';
import { formatAddress, getCleanPlaceName, getCountryInfo } from '../../utils/addressUtils';
import useStomp from '../../hooks/useStomp';
import { WebsocketAPI } from '../../services/WebsocketAPI';

const PlanDetailCreate = (data) => {
    const navigate = useNavigate();
    const { groupid, travelid } = useParams();
    const [searchParams] = useSearchParams();
    const { currentUserId } = useAuth();
    
    // URL 쿼리 파라미터에서 day 정보 가져오기
    const dayFromUrl = parseInt(searchParams.get('day')) || 1;
    // WebSocket 연결
    const { isConnected, publish } = useStomp({
        url: 'ws://localhost:8080/ws',
        groupId: groupid,
        travelId: travelid
    });

    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState('search');
    const [formData, setFormData] = useState({
        place: data?.place || '',
        address: data?.address || '',
        cost: data?.cost || '',
        tcCode: data?.tcCode || 'FOOD',
        day: data?.day || dayFromUrl 
    });
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [travelInfo, setTravelInfo] = useState(null);



    // 주소 검색
    const searchAddress = async (query) => {
        if (!query.trim()) return setSearchResults([]);

        setIsSearching(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1&accept-language=ko,en`;
            const response = await fetch(url);
            const data = await response.json();
            setSearchResults(data || []);
            console.log(data);
        } catch (error) {
            console.error('주소 검색 실패:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };
    const selectPlace = (place) => {
        setSelectedPlace(place);
        setFormData(prev => ({
            ...prev,
            place: getCleanPlaceName(place),
            address: place.display_name
        }));
        setSearchResults([]);
        setCurrentStep('detail');
    };

    // 검색 디바운싱
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery.trim()) searchAddress(searchQuery);
            else setSearchResults([]);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlace) return alert('장소를 선택해주세요.');

        if (!isConnected || !publish) {
            alert('연결이 끊어진 상태입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        setIsLoading(true);
        try {
            const planData = {
                pdPlace: formData.place,
                pdAddress: formData.address,
                pdCost: parseInt(formData.cost) || 0,
                pdDay: formData.day,
                position: `${selectedPlace.lat},${selectedPlace.lon}`,
                tcCode: formData.tcCode
            };
            console.log('요청 데이터:', planData);
            console.log('travelid:', travelid, 'groupid:', groupid);
            
            WebsocketAPI.publishInsertOperation(
                publish,
                groupid,
                travelid,
                currentUserId,
                formData.day,
                {
                    pdPlace: formData.place,
                    pdAddress: formData.address,
                    pdCost: parseInt(formData.cost) || 0,
                    tcCode: formData.tcCode
                }
            );
            console.log('일정 생성 WebSocket 메시지 전송');
            
            navigate(`/group/${groupid}/travel/${travelid}/edit`);
        } catch (error) {
            console.error('일정 생성 실패:', error);
            alert('일정 생성에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 검색 화면
    if (currentStep === 'search') {
        return (
            <div className="h-screen bg-main flex flex-col">
                <Header showBackButton title="일정 추가하기" />
                <div className="bg-white rounded-t-3xl flex-1 flex flex-col">
                    <div className="p-4">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="장소 검색"
                                className="w-full p-2 px-6 border-2 border-main focus:outline-none focus:ring-2 focus:ring-main/20 rounded-full text-lg"
                            />
                            <BiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-main" />
                            {isSearching && (
                                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        {searchResults.length === 0 && searchQuery && !isSearching && (
                            <div className="p-4 text-center text-gray-500">검색 결과가 없습니다.</div>
                        )}
                        {searchResults.map((place, index) => (
                            <div
                                id={index}
                                key={index}
                                onClick={() => selectPlace(place)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        selectPlace(place);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                className="bg-white p-4 border-b border-gray-100 flex items-center cursor-pointer hover:bg-gray-50 rounded-xl mb-2"
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                                    <IoLocationSharp className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 mb-1">{getCleanPlaceName(place)}</div>
                                    <div className="text-xs text-gray-500 mb-1">{formatAddress(place)}</div>
                                    {getCountryInfo(place) && (
                                        <div className="flex items-center space-x-1 text-xs text-blue-600 font-medium">
                                            <IoLocationSharp className="w-4 h-4 text-blue-600 mr-1" />
                                            {getCountryInfo(place)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // 상세 입력 화면
    return (
        <div className="h-screen bg-main flex flex-col">
            <Header showBackButton title="일정 추가하기" />
            <div className="bg-white rounded-t-3xl flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* 선택 장소 */}
                    <div className="p-4 flex items-center rounded-xl">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                            <IoLocationSharp className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold">{formData.place}</div>
                            <div className="text-sm text-gray-500">
                                {selectedPlace ? formatAddress(selectedPlace) : formData.address}
                            </div>
                        </div>
                    </div>

                    {/* 비용 입력 */}
                    <div className="p-4">
                        <label htmlFor="cost-input" className="block text-sm font-medium text-gray-700 mb-3">비용</label>
                        <div className="relative">
                            <input
                                id="cost-input"
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleInputChange}
                                placeholder="금액을 입력하세요"
                                className="w-full p-4 text-lg border-b-2 border-gray-200 focus:border-b-blue focus:outline-none pr-12"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                원
                            </div>
                        </div>
                    </div>

                    {/* 카테고리 선택 */}
                    <div className="p-4">
                        <label htmlFor='category-select' className="block text-sm font-medium text-gray-700 mb-3">카테고리</label>
                        <SelectPurpose
                            id='category-select'
                            type='transaction'
                            value={formData.tcCode}
                            onChange={(value) => setFormData(prev => ({ ...prev, tcCode: value }))}
                        />  
                    </div>

                    {/* 지도 표시 */}
                    {selectedPlace && (
                        <div className="px-4">
                            <div className="text-sm font-medium text-gray-700 mb-2 z-[-1]">위치 확인</div>
                            <MapComponent place={selectedPlace} formatAddress={formatAddress} />
                        </div>
                    )}
                </div>
                
                {/* 하단 버튼 - 고정 */}
                <div className="bg-white p-6 border-t border-gray-100 flex space-x-4">
                    <button
                        onClick={() => navigate(`/group/${groupid}/travel/${travelid}`)}
                        className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 py-4 bg-light-blue text-third rounded-xl font-medium hover:bg-blue shadow-lg"
                    >
                        {isLoading ? '저장 중...' : '장소 추가'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanDetailCreate;
