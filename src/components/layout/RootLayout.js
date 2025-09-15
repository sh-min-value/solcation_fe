import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../common/Header.js';
import NavigationBar from '../common/NavigationBar.js';
import GroupProfileCard from '../common/GroupProfileCard.js';
import { groupAPI } from '../../services/groupAPI.js';

export default function RootLayout({ children }) {
  const location = useLocation();
  const { groupid } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 그룹 경로인지 확인
  const isGroupRoute = location.pathname.startsWith('/group/');

  // 그룹 데이터 로드
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

  return (
    <div className="app-layout relative">
      <Header showBackButton={true} showHomeButton={true} />
      <div className="bg-main m-0">
        {isGroupRoute && groupData && <GroupProfileCard group={groupData} />}
        <main className="app-main rounded-t-3xl bg-white">{children}</main>
      </div>
      <NavigationBar />
    </div>
  );
}
