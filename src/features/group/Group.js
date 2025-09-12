import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { groupAPI } from '../../services/api';

const Group = () => {
    const location = useLocation();
    const { groupid } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // 그룹 유효성 검사
    useEffect(() => {
        const validateGroup = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // 실제 API 호출로 그룹 존재 여부 확인
                const groupData = await groupAPI.getGroup(groupid);
                console.log('그룹 데이터:', groupData);
                
                setIsLoading(false);
            } catch (err) {
                // 에러 발생 시 에러 페이지로 이동
                const errorData = err.response?.error || err;
                navigate('/error', { 
                    state: { 
                        error: errorData,
                        from: location.pathname 
                    } 
                });
            }
        };
        
        validateGroup();
    }, [groupid]);
    
    // 그룹 메인 페이지 콘텐츠
    const GroupMainContent = () => (
        <>GROUP {groupid}</>
    );
    
    // 현재 경로가 /group/:groupid 인지 확인
    const isGroupMain = location.pathname === `/group/${groupid}`;
    
    // 로딩 중
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                    <div className="text-xl text-gray-600">그룹 정보를 불러오는 중...</div>
                </div>
            </div>
        );
    }
    
    return (
        <>
            {isGroupMain ? <GroupMainContent /> : <Outlet />}
        </>
    );
};

export default Group;