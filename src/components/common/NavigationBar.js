import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { RiBankCardFill } from "react-icons/ri";
import { BiSolidPaperPlane } from "react-icons/bi";
import { TbDeviceAnalytics } from "react-icons/tb";

export default function NavigationBar() {
  const { groupid } = useParams();
  
  const items = [
    { to: `/group/${groupid}`, label: "메인", icon: <HiHome /> },
    { to: `/group/${groupid}/account`, label: "모임 통장", icon: <RiBankCardFill /> },
    { to: `/group/${groupid}/travel`, label: "여행 계획", icon: <BiSolidPaperPlane /> },
    { to: `/group/${groupid}/stat`, label: "통계", icon: <TbDeviceAnalytics /> },
  ];
  return (
    <nav className="flex justify-around items-center h-20 bg-white border-t border-gray-200 px-4 absolute bottom-0 left-0 right-0 z-50 shadow-lg">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === `/group/${groupid}`}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-gray-500 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] h-15 ${
              isActive 
                ? "text-third bg-blue-50" 
                : "hover:bg-gray-50 hover:text-gray-700"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`text-xl mb-1 flex items-center justify-center ${isActive ? "text-third" : ""}`}>
                {item.icon}
              </span>
              <span className={`text-xs font-medium whitespace-nowrap ${isActive ? "text-third" : ""}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

