import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/logo.svg';
import { HiArrowLeft, HiHome } from 'react-icons/hi';
import { BiSolidDoorOpen } from 'react-icons/bi';

const Header = ({ 
  title = "SOLcation", 
  showBackButton = false, 
  showHomeButton = false, 
  showLogoutButton = false,
  onBack = null,
  onHome = null,
  onLogout = null,
  className = ""
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await logout();
      navigate("/login");
    }
  };

  const handleLogoClick = () => {
    handleHome();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleHome();
    }
  };

  return (
    <header className={`app-header bg-main h-100 flex items-center justify-between px-4 ${className}`}>
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="text-secondary hover:text-gray-200 transition-colors p-2"
            aria-label="뒤로가기"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-start">
        {title === "SOLcation" ? (
          <h1 className="text-2xl font-bold">
            <button
              onClick={handleLogoClick}
              onKeyDown={handleKeyDown}
              className="focus:outline-none"
              aria-label="홈으로 이동"
            >
              <img 
                src={logo} 
                alt="SOLcation" 
                className="h-12 mb-4 mt-2" 
              />
            </button>
          </h1>
        ) : (
          <h1 className="text-xl font-bold text-secondary">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {showLogoutButton && (
          <button 
            onClick={handleLogout}
            className="text-secondary hover:text-gray-200 transition-colors p-2"
            aria-label="로그아웃"
          >
            <BiSolidDoorOpen className="w-6 h-6" />
          </button>
        )}
        {showHomeButton && (
          <button 
            onClick={handleHome}
            className="text-secondary hover:text-gray-200 transition-colors p-2"
            aria-label="홈으로 이동"
          >
            <HiHome className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
};


export default Header;