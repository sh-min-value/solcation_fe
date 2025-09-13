import React, { useState, useEffect } from 'react';
import { FaEdit, FaSuitcase, FaPlane, FaEnvelope } from 'react-icons/fa';
import { getGroupProfileImage } from '../../services/s3';

const GroupProfileCard = ({ group }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    // S3에서 이미지 로드
    useEffect(() => {
        const loadImage = async () => {
            if (!group.profileImg) return;
            
            setImageLoading(true);
            try {
                const url = await getGroupProfileImage(group.profileImg);
                setImageUrl(url);
            } catch (error) {
                console.error('이미지 로드 실패:', error);
                setImageUrl(null);
            } finally {
                setImageLoading(false);
            }
        };

        loadImage();
    }, [group.profileImg]);

    return (
        <div className="bg-main p-2 w-full flex items-center justify-center">
            <div className="flex space-x-2 items-center justify-center">
                {/* 그룹 프로필 이미지 */}
                <div className="w-24 h-24 bg-gray-600 rounded-xl flex-shrink-0 m-2">
                    {imageLoading ? (
                        <div className="w-24 h-24 bg-gray-600 rounded-xl flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                    ) : imageUrl ? (
                        <img 
                            src={imageUrl} 
                            alt={group.groupName}
                            className="w-24 h-24 rounded-xl object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gray-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                                {group.groupName?.charAt(0) || 'G'}
                            </span>
                        </div>
                    )}
                </div>

                
            </div>
            {/* 그룹 정보 */}
            <div className="flex-1 min-w-0">
                    {/* GROUP 라벨 */}
                    <p className="text-white text-xs font-medium my-0">#{group.gcPk.gcCode}</p>

                    
                    {/* 그룹명과 편집 버튼 */}
                    <div className="flex items-center">
                        <h1 className="text-white text-lg font-bold truncate mb-1">
                            {group.groupName || '그룹명'}
                        </h1>
                    </div>

                    {/* 통계 카드들 */}
                    <div className="grid grid-cols-3 gap-1 w-90%">
                        {/* 완료된 여정 */}
                        <div className="bg-white bg-opacity-30 rounded-lg pt-2 pb-1 text-center items-center justify-center">
                            <div className="text-white text-[10px] font-medium">완료된 여정</div>
                            <div className="flex items-center justify-center">
                                <FaSuitcase className="w-3 h-3 mr-1 text-white" />
                                <div className="text-white text-md font-bold">
                                    {group.completedTrips || 0}
                                </div>
                            </div>
                        </div>

                        {/* 예정된 여정 */}
                        <div className="bg-white bg-opacity-30 rounded-lg pt-2 pb-1 text-center items-center justify-center">
                            <div className="text-white text-[10px] font-medium">예정된 여정</div>
                            <div className="flex items-center justify-center">
                                <FaPlane className="w-3 h-3 mr-1 text-white" />
                                <div className="text-white text-md font-bold">
                                    {group.scheduledTrips || 0}
                                </div>
                            </div>
                        </div>

                        {/* 대기 중인 초대 */}
                        <div className="bg-white bg-opacity-30 rounded-lg pt-2 pb-1 text-center items-center justify-center">
                            <div className="text-white text-[10px] font-medium">대기 초대</div>
                            <div className="flex items-center justify-center">
                                <FaEnvelope className="w-3 h-3 mr-1 text-white" />
                                <div className="text-white text-md font-bold">
                                    {group.pendingInvitations || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default GroupProfileCard;
