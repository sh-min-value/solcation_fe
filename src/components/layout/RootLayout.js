import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header.js';
import NavigationBar from '../common/NavigationBar.js';
import GroupProfileCard from '../common/GroupProfileCard.js';
import PasswordInput from '../common/PasswordInput.js';
import { GroupAPI } from '../../services/GroupAPI.js';
import { AccountAPI } from '../../services/AccountAPI.js';
import { TransactionAPI } from '../../services/TransactionAPI.js';

// 상수들을 컴포넌트 외부로 이동
const SESSION_KEY_PREFIX = 'password_auth_session_';
const SESSION_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes

export default function RootLayout({ children, title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { groupid } = useParams();
  const [groupData, setGroupData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordTitle, setPasswordTitle] = useState("비밀번호를 입력해주세요");
  const [accountInfo, setAccountInfo] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  // 계산된 값들을 useMemo로 최적화
  const isGroupRoute = useMemo(() => 
    location.pathname.startsWith('/group/') &&
    !/^\/group\/[^/]+\/account\/transaction\/[^/]+$/.test(location.pathname) &&
    !/^\/group\/[^/]+\/account\/card\/[^/]+$/.test(location.pathname),
    [location.pathname]
  );

  const requiresPassword = useMemo(() => 
    location.pathname.includes('/account') || 
    location.pathname.includes('/card'),
    [location.pathname]
  );
  // 비밀번호 인증 상태 확인 
  
  // 계좌/카드별로 다른 세션 키 생성
  const getSessionKey = useCallback(() => {
    if (location.pathname.includes('/account') && !location.pathname.includes('/card')) {
      return `${SESSION_KEY_PREFIX}${groupid}_account`;
    } else if (location.pathname.includes('/card')) {
      return `${SESSION_KEY_PREFIX}${groupid}_card`;
    }
    return `${SESSION_KEY_PREFIX}${groupid}`;
  }, [groupid, location.pathname]);

  const isPasswordAuthenticated = useCallback(() => {
    const sessionKey = getSessionKey();
    const savedSession = localStorage.getItem(sessionKey);
    if (savedSession) {
      const { timestamp } = JSON.parse(savedSession);
      if (Date.now() - timestamp < SESSION_EXPIRATION_TIME) {
        return true;
      } else {
        localStorage.removeItem(sessionKey);
        return false;
      }
    }
    return false;
  }, [getSessionKey]);

  useEffect(() => {
    if (groupid) {
      const loadGroupData = async () => {
        try {
          const data = await GroupAPI.getGroup(groupid);
          setGroupData(data);
        } catch (error) {
          console.error('그룹 데이터 로드 실패:', error);
          setGroupData(null);
          navigate('/error', {
            state: {
              error: error.response,
              from: location.pathname,
            },
          });
        }
      };
      loadGroupData();
    } else {
      setGroupData(null);
    }
  }, [groupid, refreshKey]);

  // 계좌/카드 정보 가져오기
  const fetchAccountCardInfo = useCallback(async () => {
    if (!groupid) return;
    
    try {
      if (location.pathname.includes('/account') && !location.pathname.includes('/card')) {
        // 일반 계좌 페이지
        const accountData = await AccountAPI.getAccountInfo(groupid);
        setAccountInfo(accountData);
      } else if (location.pathname.includes('/card')) {
        // 카드 페이지
        const cardMatch = location.pathname.match(/\/card\/(\d+)/);
        if (cardMatch) {
          const sacPk = cardMatch[1];
          const cardData = await TransactionAPI.getCardInfo(groupid, sacPk);
          setCardInfo({ ...cardData, sacPk });
        }
      }
    } catch (error) {
      console.error('계좌/카드 정보 가져오기 실패:', error);
    }
  }, [groupid, location.pathname]);

  // 비밀번호 인증 모달 표시 여부 확인
  useEffect(() => {
    if (requiresPassword && !isPasswordAuthenticated()) {
      setShowPasswordModal(true);
      // 경로에 따른 제목 설정
      if (location.pathname.includes('/account') && !location.pathname.includes('/card')) {
        setPasswordTitle("계좌 정보 확인을 위해\n비밀번호를 입력해주세요");
        fetchAccountCardInfo();
      } else if (location.pathname.includes('/card')) {
        setPasswordTitle("카드 정보 확인을 위해\n비밀번호를 입력해주세요");
        fetchAccountCardInfo();
      }
    } else {
      setShowPasswordModal(false);
    }
  }, [location.pathname, groupid, requiresPassword, isPasswordAuthenticated, fetchAccountCardInfo]);

  const showGroupUI = useMemo(() => isGroupRoute && groupData, [isGroupRoute, groupData]);

  // 비밀번호 인증 성공 핸들러
  const handlePasswordSuccess = useCallback((password) => {
    const sessionKey = getSessionKey();
    localStorage.setItem(sessionKey, JSON.stringify({ timestamp: Date.now() }));
    setShowPasswordModal(false);
  }, [getSessionKey]);

  // 비밀번호 인증 취소 핸들러
  const handlePasswordCancel = useCallback(() => {
    setShowPasswordModal(false);
    window.history.back();
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col" key={refreshKey}>
        <Header
          showBackButton={true}
          showHomeButton={showGroupUI}
          title={title}
        />

        <div className="bg-main flex-1 flex flex-col">
          {showGroupUI && <GroupProfileCard group={groupData} />}
          <div className="app-main flex-1 rounded-t-3xl bg-white">
            {children || <Outlet context={{ triggerRefresh, groupData }} />}
          </div>
        </div>

        {showGroupUI && <NavigationBar />}
      </div>

      {/* 비밀번호 인증 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 h-screen overflow-hidden flex items-center justify-center">
          <PasswordInput
            onSuccess={handlePasswordSuccess}
            onCancel={handlePasswordCancel}
            title={passwordTitle}
            groupid={groupid}
            accountinfo={accountInfo}
            cardinfo={cardInfo}
          />
        </div>
      )}
    </>
  );
}
