import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';

export default function useStomp({ url, groupId, travelId, onMessage, reconnectDelay = 5000 }) {
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  // onMessage가 바뀌더라도 ref만 바꿔서 client 재생성을 막음
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  useEffect(() => {
    if (!url) return;

    // 이미 활성화된 클라이언트가 있으면 재생성하지 않음
    if (clientRef.current && clientRef.current.active) {
      console.debug('useStomp: client already active — skip new creation');
      return;
    }

    const client = new Client({
      brokerURL: url,
      connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      reconnectDelay, // ms, 너무 작지 않게 (예: 5000)
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      // 자동 재연결이 너무 빈번하면 여기서 로그를 남겨서 원인 추적
      onConnect: (frame) => {
        console.log('[STOMP] connected', frame);
        setIsConnected(true);
        setError(null);

        // 구독: 구독은 연결시 한 번만 만들고 ref에 저장
        if (groupId && travelId && !subscriptionRef.current) {
          const topic = `/topic/travel/${travelId}/edit`;
          console.log('[STOMP] subscribe', topic);
          subscriptionRef.current = client.subscribe(topic, (message) => {
            try {
              const body = message.body ? JSON.parse(message.body) : null;
              // 최신 onMessage 사용
              onMessageRef.current && onMessageRef.current(body);
            } catch (e) {
              console.error('[STOMP] message parse error', e);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('[STOMP] stomp error', frame);
        setError(frame);
      },
      onWebSocketError: (ev) => {
        console.error('[STOMP] websocket error', ev);
      },
      onDisconnect: () => {
        console.log('[STOMP] disconnected');
        setIsConnected(false);
        // 구독 해제(안정성)
        if (subscriptionRef.current) {
          try { subscriptionRef.current.unsubscribe(); } catch (e) { /* ignore */ }
          subscriptionRef.current = null;
        }
      },
      debug: () => {} // 디버그 로그 너무 많으면 비움
    });

    // 저장
    clientRef.current = client;
    client.activate();

    // cleanup — 언마운트 시 안전하게 deactivate
    return () => {
      (async () => {
        try {
          if (subscriptionRef.current) {
            try { subscriptionRef.current.unsubscribe(); } catch (e) { /* ignore */ }
            subscriptionRef.current = null;
          }
          if (clientRef.current) {
            // deactivate는 promise-like
            if (clientRef.current.active) {
              await clientRef.current.deactivate();
            }
          }
        } catch (e) {
          console.warn('[useStomp] cleanup error', e);
        } finally {
          clientRef.current = null;
          setIsConnected(false);
        }
      })();
    };
    // 중요한: accessToken/url 변화만으로 재생성되게 한다.
    // groupId/travelId/onMessage 등은 ref로 처리하여 재생성을 막음.
  }, [url, accessToken, reconnectDelay]);

  const safeConnected = () => {
    const c = clientRef.current;
    return !!(c && c.active && c.connected);};

  const publish = ({ destination, body, headers = {} }) => {
    const client = clientRef.current;
    if (!safeConnected()) {
      console.warn('useStomp: not connected yet');
      return false;
    }
    const publishHeaders = { 'content-type': 'application/json', ...headers };
    try {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      client.publish({ destination, body: payload, headers: publishHeaders });
      return true;
    } catch (e) {
      console.error('useStomp: publish error', e);
      return false;
    }
  };

  const publishOp = (opMessage) => {
    if (!groupId || !travelId) {
      console.warn('useStomp: missing groupId/travelId for op publish');
      return false;
    }
    return publish({ destination: `/app/group/${groupId}/travel/${travelId}/edit/op`, body: opMessage });
  };

  return { isConnected, error, publish, publishOp, client: clientRef.current };
}
