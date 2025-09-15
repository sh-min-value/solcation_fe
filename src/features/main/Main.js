import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mainAPI } from '../../services/MainAPI';
import MyGroupsSection from './components/MyGroupsSection';
import UserProfileSection from './components/UserProfileSection';
import NotificationSection from './components/NotificationSection';
import CalendarSection from './components/CalendarSection';
import EventSection from './components/EventSection';

const Main = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 그룹 상태 관리
  const [myGroups, setMyGroups] = useState([]);

  // 사용자 프로필 상태 관리
  const [userProfile, setUserProfile] = useState(null);

  // 사용자 프로필 로딩 상태
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // 알림 상태 관리
  const [notifications, setNotifications] = useState([]);

  // 이벤트 상태 관리
  const [events, setEvents] = useState([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  // API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 그룹 목록 조회
        const groupsResponse = await mainAPI.getMyGroups();
        setMyGroups(groupsResponse);

        // 사용자 프로필 조회
        const profileResponse = await mainAPI.getUserProfile();
        setUserProfile(profileResponse);
        setIsProfileLoading(false);

        // 사용자 알림 조회
        try {
          const notificationsResponse = await mainAPI.getUserNotifications();
          setNotifications(notificationsResponse);
        } catch (notificationError) {
          // 알림 API 실패 시 빈 배열로 설정
          setNotifications([]);
        }

        // 월간 계획 조회
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // JavaScript는 0부터 시작하므로 +1

        try {
          const eventsResponse = await mainAPI.getMonthlyPlans(year, month);
          setEvents(eventsResponse);
        } catch (eventsError) {
          console.error('월간 계획 API 에러:', eventsError);
          console.error('에러 응답:', eventsError.response);
          // 월간 계획 API 실패 시 빈 배열로 설정
          setEvents([]);
        }

        setIsEventsLoading(false);
      } catch (error) {
        console.error('API 호출 실패:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100% flex flex-col">
      <Header showLogoutButton={true} />

      <div className="flex-1 p-6 w-full overflow-y-auto">
        <MyGroupsSection myGroups={myGroups} navigate={navigate} />
        <UserProfileSection
          userProfile={userProfile}
          isProfileLoading={isProfileLoading}
          user={user}
        />
        <NotificationSection
          notifications={notifications}
          navigate={navigate}
        />
        <CalendarSection />
        <EventSection events={events} isLoading={isEventsLoading} />
      </div>
    </div>
  );
};

export default Main;
