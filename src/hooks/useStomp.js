import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';

export default function useStomp({ url, groupId, travelId, onMessage, reconnectDelay = 5000 }) {
  const clientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken, tokenType } = useAuth();

  useEffect(() => {
    if (!url) return;

    const client = new Client({
      brokerURL: url,
      connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      reconnectDelay,
      onConnect: () => {
        console.log('STOMP 연결됨');
        setIsConnected(true);
        setError(null);

        // 서버가 publish 하는 토픽: /topic/group/{g}/travel/{t}/edit
        if (groupId && travelId) {
          const topic = `/topic/group/${groupId}/travel/${travelId}/edit`;
          console.log('토픽 구독:', topic);
          client.subscribe(topic, (message) => {
            try {
              const body = message.body ? JSON.parse(message.body) : null;
              console.log('메시지 수신:', body);
              onMessage && onMessage(body);
            } catch (e) {
              console.error('useStomp: 메시지 파싱 오류', e);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.error('useStomp: STOMP error frame', frame);
        setError(frame);
      },
      onWebSocketError: (ev) => {
        console.error('useStomp: WebSocket error', ev);
      },
      onDisconnect: () => {
        console.log('STOMP 연결 끊어짐');
        setIsConnected(false);
      },
      debug: (str) => {
        console.debug('[STOMP]', str);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      try {
        console.log('STOMP 클라이언트 정리');
        client.deactivate();
      } catch (e) {
        // ignore
      }
      clientRef.current = null;
    };
  }, [url, accessToken, groupId, travelId, reconnectDelay]);

  const publish = ({ destination, body, headers = {} }) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      console.warn('useStomp: not connected yet');
      return;
    }

    const publishHeaders = { 'content-type': 'application/json', ...headers };

    client.publish({
      destination,
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: publishHeaders,
    });
  };

  const publishOp = (opMessage) => {
    if (!groupId || !travelId) {
      console.warn('useStomp: missing groupId or travelId for op publish');
      return;
    }
    const destination = `/app/group/${groupId}/travel/${travelId}/edit/op`;
    publish({ destination, body: opMessage });
  };

  return { isConnected, error, publish, publishOp, client: clientRef.current };
}
