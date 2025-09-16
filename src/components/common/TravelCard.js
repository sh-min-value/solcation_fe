import React, { useState, useEffect } from 'react';
import { getTravelProfileImage } from '../../services/s3';
import { getStateIcon, getTravelCategoryIcon } from '../../utils/CategoryIcons';

const TravelCard = ({ travel, groupid, onClick }) => {
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
            className='w-full bg-white p-3 my-4 rounded-xl shadow-lg flex items-center space-x-2 justify-between cursor-pointer' 
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className='flex items-center space-x-2'>
                <img src={imageUrl} alt={travel.title} className='w-16 h-16 m-2 object-cover rounded-lg' />
                <div className='flex flex-col space-y-1'>
                    <div className='flex space-x-1 items-end'>
                        <h3 className='text-md font-bold mr-2'>{travel.title}</h3>
                        <p className='text-xs text-gray-400 mb-1'>  | {travel.location}</p>
                    </div>
                    <div className='text-xs flex'>
                        <p>{formatDate(travel.startDate)} ~ {formatDate(travel.endDate)}</p>
                    </div>
                            <div className='flex items-center space-x-1 mt-8'>
                                <div className='bg-gray-200 rounded-lg px-2 py-1 text-xs flex items-center space-x-1'>
                                    {getStateIcon(travel.state)}
                                </div>
                                <div className='bg-gray-200 rounded-lg px-2 py-1 text-xs flex items-center space-x-1'>
                                    {getTravelCategoryIcon(travel.categoryCode)}
                                </div>
                            </div>
                    
                </div>
            </div>
            
            <div className="text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
            
            
        </div>
    );
};   

export default TravelCard;