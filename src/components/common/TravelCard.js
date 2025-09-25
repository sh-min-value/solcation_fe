import React, { useState, useEffect } from 'react';
import { getTravelProfileImage } from '../../services/s3';
import { getStateIcon, getTravelCategoryIcon } from '../../utils/CategoryIcons';
import { FaUserGroup } from 'react-icons/fa6';

const TravelCard = ({ travel, groupid, onClick, className }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageLoading, setImageLoading] = useState(false);

    // 날짜 형식을 2025-09-01에서 2025.09.01로 변경
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.replace(/-/g, '.');
    };


    useEffect(() => {
        const loadImage = async () => {
            const url = await getTravelProfileImage(travel.thumbnail);
            setImageUrl(url);
            setImageLoading(false);
        };
        loadImage();
    }, [travel.thumbnail]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    console.log('travel', travel);

    return (
        <div
            className={`bg-white backdrop-blur-sm rounded-3xl p-4 my-4 mx-1 shadow-[0_0_5px_rgba(0,0,0,0.1)] transition-all duration-200 cursor-pointer transform hover:-translate-y-1 hover:shadow-lg flex flex-row items-center space-x-4 ${className}`}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className='flex items-center space-x-1'>
                <img src={imageUrl} alt={travel.title} className='w-16 h-16 m-1 object-cover rounded-lg' />
                <div className='flex flex-col space-y-1'>
                    <div className='flex space-x-1 items-end'>
                        <h3 className='text-md font-bold mr-1 max-w-24 line-clamp-1 truncate'>{travel.title}</h3>
                        <p className='text-xs text-gray-500 mb-1 max-w-24 line-clamp-1 truncate'>  | {travel.location}</p>
                    </div>
                    <div className='text-xs flex'>
                        <p>{formatDate(travel.startDate)} ~ {formatDate(travel.endDate)}</p>
                    </div>
                    <div className='flex items-center space-x-1 mt-8 text-[10px] w-full overflow-x-scroll'>
                        <div className='bg-gray-200 rounded-lg px-2 py-1 flex items-center space-x-1 '>
                            {getStateIcon(travel.state)}
                        </div>
                        <div className='bg-gray-200 rounded-lg px-2 py-1 flex items-center space-x-1'>
                            {getTravelCategoryIcon(travel.categoryCode)}
                        </div>
                        <div className='bg-gray-200 rounded-lg px-2 py-1 flex items-center space-x-1'>
                            <FaUserGroup className='w-3 h-3 mr-1 text-gray-500' />
                            {travel.participant}
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>


        </div>
    );
};

export default TravelCard;