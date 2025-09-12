import React from 'react';
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom'; 

const GroupList = () => {
    const navigate = useNavigate();
    return (
        <>
        <Header
        showBackButton={true}
        showHomeButton={true}
        />
        GROUPList
        <button onClick={() => navigate('/group/1')}>그룹 1</button>
        </>
    );
};

export default GroupList;