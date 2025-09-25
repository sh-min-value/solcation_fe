import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { notificationEmitter } from '../utils/EventEmitter';

const SSEContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_PATH = '/notification/conn';

export const SSEProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const esRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [connectionError, setConnectionError] = useState(null);

  const connect = useCallback(
    accessToken => {
      if (connecting || (connected && esRef.current)) {
        console.log('SSE: 이미 연결 중이거나 연결되어 있습니다.');
        return;
      }

      if (!accessToken) {
        console.warn('SSE: 토큰이 없습니다.');
        return;
      }

      // 이전 연결 정리
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      setConnecting(true);
      setConnectionError(null);

      const url = `${API_BASE_URL}${API_PATH}`;
      console.log('SSE: 연결 시도 중...', url);

      const es = new EventSourcePolyfill(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Cache-Control': 'no-cache',
        },
        withCredentials: false,
        heartbeatTimeout: 60_000,
      });

      esRef.current = es;

      es.onopen = () => {
        console.log('SSE: 연결 성공');
        setConnected(true);
        setConnecting(false);
        setConnectionError(null);
      };

      //이름 지정된 메시지 수신
      es.addEventListener('alarm', e => {
        try {
          const data = JSON.parse(e.data);
          console.log('SSE: 메시지 수신', data);
          notificationEmitter.emit('alarm', data);
        } catch (error) {
          console.error('SSE: 메시지 파싱 실패', error, e.data);
        }
      });

      //이름 지정되지 않은 메시지 수신
      es.onmessage = e => {
        try {
          const data = JSON.parse(e.data);
          console.log('SSE: 메시지 수신', data);
          notificationEmitter.emit('alarm', data);
        } catch (error) {
          console.error('SSE: 메시지 파싱 실패', error, e.data);
        }
      };

      es.onerror = err => {
        console.error('SSE: 연결 오류', err);
        setConnected(false);
        setConnecting(false);
        setConnectionError('연결 오류가 발생했습니다.');

        if (esRef.current) {
          esRef.current.close();
          esRef.current = null;
        }

        // 3초 후 재연결 시도
        if (accessToken) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('SSE: 재연결 시도');
            connect(accessToken);
          }, 3000);
        }
      };
    },
    [connected, connecting]
  );

  const disconnect = useCallback(() => {
    console.log('SSE: 연결 해제');

    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnected(false);
    setConnecting(false);
    setConnectionError(null);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value = {
    connected,
    connecting,
    connectionError,
    connect,
    disconnect,
  };

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
};

export const useSSEContext = () => {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error('useSSEContext는 SSEProvider 내에서 사용해야 합니다');
  }
  return context;
};
