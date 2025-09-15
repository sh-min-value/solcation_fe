import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Header from "../common/Header.js";
import NavigationBar from "../common/NavigationBar.js";
import GroupProfileCard from "../common/GroupProfileCard.js";
import { groupAPI } from "../../services/api";

export default function RootLayout({ children, title }) {
  const location = useLocation();
  const { groupid } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isGroupRoute = location.pathname.startsWith('/group/');

  useEffect(() => {
    if (isGroupRoute && groupid) {
      const loadGroupData = async () => {
        try {
          setIsLoading(true);
          const data = await groupAPI.getGroup(groupid);
          setGroupData(data);
        } catch (error) {
          console.error('그룹 데이터 로드 실패:', error);
          setGroupData(null);
        } finally {
          setIsLoading(false);
        }
      };
      loadGroupData();
    } else {
      setGroupData(null);
    }
  }, [isGroupRoute, groupid]);

  const showGroupUI = isGroupRoute && groupData;

  return (
    <div className="app-layout relative">
      <Header 
        showBackButton={true}
        showHomeButton={showGroupUI}
        title={title}
      />
      
      <div className="bg-main m-0">
        {showGroupUI && <GroupProfileCard group={groupData} />}
        <main className="app-main rounded-t-3xl bg-white">{children}</main>
      </div>
      
      {showGroupUI && <NavigationBar />}
    </div>
  );
}
