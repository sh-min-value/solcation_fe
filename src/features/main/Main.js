import React from 'react';
import Header from '../../components/common/Header';

const Main = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-main via-main to-secondary">
            <Header showLogoutButton={true} />
            <>Main</>
        </div>
    );
};

export default Main;