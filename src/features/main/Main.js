import React from 'react';
import Header from '../../components/common/Header';

const Main = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100%">
            <Header showLogoutButton={true} />
            <>Main</>
        </div>
    );
};

export default Main;