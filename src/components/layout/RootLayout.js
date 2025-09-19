import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../common/Header.js';
import NavigationBar from '../common/NavigationBar.js';
import GroupProfileCard from '../common/GroupProfileCard.js';
import { GroupAPI } from '../../services/GroupAPI.js';

export default function RootLayout({ children, title }) {
  const location = useLocation();
  const { groupid } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  const isGroupRoute =
    location.pathname.startsWith('/group/') &&
    !/^\/group\/[^/]+\/account\/transaction\/[^/]+$/.test(location.pathname) &&
    !/^\/group\/[^/]+\/account\/card\/[^/]+$/.test(location.pathname);

  useEffect(() => {
    if (isGroupRoute && groupid) {
      const loadGroupData = async () => {
        try {
          const data = await GroupAPI.getGroup(groupid);
          setGroupData(data);
        } catch (error) {
          console.error('그룹 데이터 로드 실패:', error);
          setGroupData(null);
        }
      };
      loadGroupData();
    } else {
      setGroupData(null);
    }
  }, [isGroupRoute, groupid, refreshKey]);

  const showGroupUI = isGroupRoute && groupData;

  return (
    <div className="min-h-screen flex flex-col" key={refreshKey}>
      <Header
        showBackButton={true}
        showHomeButton={showGroupUI}
        title={title}
      />

      <div className="bg-main flex-1 flex flex-col">
        {showGroupUI && <GroupProfileCard group={groupData} />}
        <div className="app-main flex-1 rounded-t-3xl bg-white">
          {React.cloneElement(children, { triggerRefresh })}
        </div>
      </div>

      {showGroupUI && <NavigationBar />}
    </div>
  );
}
