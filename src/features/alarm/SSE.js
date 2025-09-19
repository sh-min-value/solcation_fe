import { EventSourcePolyfill } from 'event-source-polyfill';
import { useEffect, useRef, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_PATH = '/notification/conn';

export function useSSE({ token }) {
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    if (!token) return;

    const url = `${API_BASE_URL}${API_PATH}`;

    const es = new EventSourcePolyfill(url, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: false,
      heartbeatTimeout: 20_000,
    });
    esRef.current = es;

    es.onopen = () => {
      console.log('suc');
      setConnected(true);
    };

    es.onmessage = e => {
      try {
        const data = JSON.parse(e.data);
        console.log(data);
      } catch {
        console.log('error');
      }
    };

    es.onerror = err => {
      setConnected(false);
      // 기본 EventSource는 자동 재연결(backoff) 시도함
      // 401/403이면 서버가 바로 끊을 수 있으니 토큰 갱신 로직과 함께 새로 열기 필요
    };

    return () => {
      es.close();
      setConnected(false);
    };
  }, [token]);

  return connected;
}
