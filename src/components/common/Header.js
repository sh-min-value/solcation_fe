import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { HiArrowLeft, HiHome } from "react-icons/hi";
import { BiSolidDoorOpen } from "react-icons/bi";

export default function Header({ 
  title = "SOLcation", 
  showBackButton = false, 
  showHomeButton = false, 
  showLogoutButton = false,
  onBack = null,
  onHome = null,
  onLogout = null,
  className = ""
}) {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // 기본 로그아웃 로직
      console.log("로그아웃");
    }
  };

  return (
    <header className={`app-header bg-main h-100 flex items-center justify-between px-4 ${className}`}>
      <div className="flex items-center space-x-2">
        {showBackButton && (
          <button 
            onClick={handleBack}
            className="text-secondary hover:text-gray-200 transition-colors p-2"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex-1 flex justify-start">
        {title === "SOLcation" ? (
          <h1 className="text-2xl font-bold">
            <img src={logo} alt="SOLcation" className="h-12 mb-4 mt-2" onClick={handleHome} />
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
          >
            <BiSolidDoorOpen className="w-6 h-6" />
          </button>
        )}
        {showHomeButton && (
          <button 
            onClick={handleHome}
            className="text-secondary hover:text-gray-200 transition-colors p-2"
          >
            <HiHome className="w-6 h-6" />
          </button>
        )}
      </div>
    </header>
  );
}
  