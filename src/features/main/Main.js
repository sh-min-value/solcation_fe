import React from 'react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';

const Main = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100%">
            <Header showLogoutButton={true} />
            {user ? (
                <div>
                    <p>{user.userId}</p>
                    <p>{user.userName}</p>
                    <p>{user.email}</p>
                    <p>{user.tel}</p>
                </div>
            ) : (null)}
        </div>
    );
};

export default Main;