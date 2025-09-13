import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { groupAPI } from '../../services/api';

const Group = () => {
    const location = useLocation();
    const { groupid } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [groupData, setGroupData] = useState(null);
    
    // 그룹 유효성 검사
    useEffect(() => {
        const validateGroup = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const data = await groupAPI.getGroup(groupid);
                console.log('그룹 데이터:', data);
                setGroupData(data);
                
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
    
    const GroupMainContent = () => (
        <div className="bg-white">GROUP {groupid}</div>
    );
    
    // 현재 경로가 /group/:groupid 인지 확인
    const isGroupMain = location.pathname === `/group/${groupid}`;
    
    if (isLoading) {
        return (
            <p>로딩중...</p>
        );
    }
    
    return (
        <>
            {isGroupMain ? <GroupMainContent /> : <Outlet />}
        </>
    );
};

export default Group;