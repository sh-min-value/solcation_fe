import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSSEContext } from '../../context/SSEContext';

const SSEConnector = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const { connect, disconnect, connected } = useSSEContext();

  useEffect(() => {
    if (isAuthenticated && accessToken && !connected) {
      console.log('SSE 연결 시작');
      connect(accessToken);
    } else if (!isAuthenticated && connected) {
      console.log('SSE 연결 해제');
      disconnect();
    }
  }, [isAuthenticated, accessToken, connected, connect, disconnect]);

  // 로그아웃 -> 연결 해제
  useEffect(() => {
    if (!isAuthenticated) {
      disconnect();
    }
  }, [isAuthenticated, disconnect]);

  return null;
};

export default SSEConnector;
