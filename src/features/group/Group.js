import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

const Group = () => {
    const location = useLocation();
    const { groupid } = useParams();
    
    // 그룹 메인 페이지 콘텐츠
    const GroupMainContent = () => (
        <>
        GROUP {groupid}
        </>
    );
    
    // 현재 경로가 /group/:groupid 인지 확인
    const isGroupMain = location.pathname === `/group/${groupid}`;
    
    return (
        <>
            {isGroupMain ? <GroupMainContent /> : <Outlet />}
        </>
    );
};

export default Group;