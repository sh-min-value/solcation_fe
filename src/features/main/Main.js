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
import {
  GroupsSkeleton,
  UserProfileSkeleton,
  NotificationsSkeleton,
  CalendarSkeleton,
  EventsSkeleton,
  FadeInWrapper,
} from './components/LoadingSkeleton';

const Main = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 상태 관리
  const [myGroups, setMyGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useState([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(true);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(true);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  // API 함수
  const fetchGroups = async () => {
    try {
      const groupsResponse = await mainAPI.getMyGroups();
      setMyGroups(groupsResponse);
    } catch (error) {
      console.error('그룹 목록 조회 실패 :', error);
      navigate('/error', {
        state: {
          error: error,
          from: location.pathname,
        },
      });
      setMyGroups([]);
    } finally {
      setIsGroupsLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const notificationsResponse = await mainAPI.getUserNotifications();
      setNotifications(notificationsResponse);
      console.log(notificationsResponse);
    } catch (error) {
      console.error('알림 조회 실패 :', error);
      navigate('/error', {
        state: {
          error: error,
          from: location.pathname,
        },
      });
      setNotifications([]);
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  const fetchMonthlyPlans = async () => {
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const eventsResponse = await mainAPI.getMonthlyPlans(year, month);
      setEvents(eventsResponse);
    } catch (error) {
      console.error('월간 계획 조회 실패 :', error);
      setEvents([]);
    } finally {
      setIsEventsLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchGroups()]);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchNotifications()]);
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchMonthlyPlans()]);
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen bg-gradient-to-b from-main from-0% via-main via-20% to-secondary to-100% flex flex-col">
      <Header showLogoutButton={true} />

      <div className="flex-1 p-6 w-full overflow-y-auto">
        {/* User Profile Section */}
        <FadeInWrapper isLoading={false} delay={100}>
          <UserProfileSection user={user} />
        </FadeInWrapper>

        {/* My Groups Section */}
        {isGroupsLoading ? (
          <GroupsSkeleton />
        ) : (
          <FadeInWrapper isLoading={false} delay={0}>
            <MyGroupsSection myGroups={myGroups} navigate={navigate} />
          </FadeInWrapper>
        )}
        {/* Notification Section */}
        {isNotificationsLoading ? (
          <NotificationsSkeleton />
        ) : (
          <FadeInWrapper isLoading={false} delay={200}>
            <NotificationSection
              notifications={notifications}
              navigate={navigate}
            />
          </FadeInWrapper>
        )}

        {/* Calendar Section */}
        {isEventsLoading ? (
          <CalendarSkeleton />
        ) : (
          <FadeInWrapper isLoading={false} delay={300}>
            <CalendarSection events={events} />
          </FadeInWrapper>
        )}

        {/* Event Section */}
        {isEventsLoading ? (
          <EventsSkeleton />
        ) : (
          <FadeInWrapper isLoading={false} delay={400}>
            <EventSection events={events} isLoading={isEventsLoading} />
          </FadeInWrapper>
        )}
      </div>
    </div>
  );
};

export default Main;
