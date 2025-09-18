import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../context/AuthContext';
import { WebsocketAPI } from '../services/WebsocketAPI';

export default function useStomp({ url, groupId, travelId, onMessage, onJoinResponse, reconnectDelay = 5000, onRefreshData, autoJoin = true }) {
  const clientRef = useRef(null);
  const editSubRef = useRef(null);
  const topicSubRef = useRef(null); 
  const onMessageRef = useRef(onMessage);
  const onJoinResponseRef = useRef(onJoinResponse);
  const onRefreshDataRef = useRef(onRefreshData);
  const hasJoinedRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();

  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onJoinResponseRef.current = onJoinResponse; }, [onJoinResponse]);
  useEffect(() => { onRefreshDataRef.current = onRefreshData; }, [onRefreshData]);

  useEffect(() => {
    if (!url) return;
    if (clientRef.current && clientRef.current.active) return;

    const client = new Client({
      brokerURL: url,
      connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: (frame) => {
        console.log('[STOMP] connected', frame);
        setIsConnected(true);
        setError(null);

        // 편집 전용 토픽 구독 (기존)
        if (groupId && travelId && !editSubRef.current) {
          const editTopic = `/topic/travel/${travelId}/edit`;
          console.log('[STOMP] subscribe 편집 토픽:', editTopic);
          editSubRef.current = client.subscribe(editTopic, (message) => {
            console.log('[STOMP] /edit 토픽 메시지 받음:', message.body);
            try {
              const body = message.body ? JSON.parse(message.body) : null;
              onMessageRef.current && onMessageRef.current(body);
            } catch (e) {
              console.error('[STOMP] edit message parse error', e);
            }
          });
        }

        // 전체 presence 토픽 구독 (서버에서 snapshot을 보냄)
        if (travelId && !topicSubRef.current) {
          const topic = `/topic/travel/${travelId}`;
          console.log('[STOMP] subscribe 전체 토픽:', topic);
          topicSubRef.current = client.subscribe(topic, (message) => {
            console.log('[STOMP] 전체 토픽 메시지 받음:', message.body);
            try {
              const body = message.body ? JSON.parse(message.body) : null;
              // presence-join 등의 메시지는 onJoinResponse에 전달할 수도 있음
              if (body && body.type === 'presence-join') {
                // 우선 onJoinResponse가 있으면 호출 (server에서 snapshot을 붙여서 보낼 때 사용)
                if (onJoinResponseRef.current) {
                  console.log('[STOMP] onJoinResponse 호출:', body);
                  onJoinResponseRef.current(body);
                }
                // 그리고 일반 메시지 핸들러도 호출해서 다른 로직 처리 가능하게 함
                console.log('[STOMP] onMessage 호출 (presence-join):', body);
                onMessageRef.current && onMessageRef.current(body);
              } else {
                console.log('[STOMP] onMessage 호출 (일반):', body);
                onMessageRef.current && onMessageRef.current(body);
              }
            } catch (e) {
              console.error('[STOMP] topic message parse error', e);
            }
          });
        }

        if (travelId) {
          const userTopic = `/user/topic/travel/${travelId}`;
          client.subscribe(userTopic, (message) => {
            try {
              const body = message.body ? JSON.parse(message.body) : null;
              
              if (body && body.type === 'join-response') {
                if (onJoinResponseRef.current) {
                  onJoinResponseRef.current(body);
                }
              }
              
              console.log('[STOMP] 개별 메시지 onMessage 호출:', body);
              onMessageRef.current && onMessageRef.current(body);
            } catch (e) {
              console.error('[STOMP] user message parse error', e);
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
        if (editSubRef.current) { 
          try { 
            console.log('[STOMP] unsubscribe 편집 토픽');
            editSubRef.current.unsubscribe(); 
          } catch (e) {
            console.warn('[STOMP] edit unsubscribe error', e);
          } 
          editSubRef.current = null; 
        }
        if (topicSubRef.current) { 
          try { 
            console.log('[STOMP] unsubscribe 전체 토픽');
            topicSubRef.current.unsubscribe(); 
          } catch (e) {
            console.warn('[STOMP] topic unsubscribe error', e);
          } 
          topicSubRef.current = null; 
        }
      },
      debug: (str) => {
        // console.log('[STOMP DEBUG]', str);
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      (async () => {
        try {
          if (editSubRef.current) { 
            try { 
              console.log('[STOMP] cleanup: unsubscribe 편집 토픽');
              editSubRef.current.unsubscribe(); 
            } catch (e) {
              console.warn('[STOMP] cleanup edit unsubscribe error', e);
            } 
            editSubRef.current = null; 
          }
          if (topicSubRef.current) { 
            try { 
              console.log('[STOMP] cleanup: unsubscribe 전체 토픽');
              topicSubRef.current.unsubscribe(); 
            } catch (e) {
              console.warn('[STOMP] cleanup topic unsubscribe error', e);
            } 
            topicSubRef.current = null; 
          }
          if (clientRef.current && clientRef.current.active) {
            console.log('[STOMP] cleanup: deactivate client');
            await clientRef.current.deactivate();
          }
        } catch (e) {
          console.warn('[useStomp] cleanup error', e);
        } finally {
          clientRef.current = null;
          setIsConnected(false);
        }
      })();
    };
  }, [url, accessToken, reconnectDelay]);

  const safeConnected = () => {
    const c = clientRef.current;
    return !!(c && c.active && c.connected);
  };

  const publish = useCallback(({ destination, body, headers = {} }) => {
    const client = clientRef.current;
    if (!safeConnected()) {
      console.warn('useStomp: not connected yet');
      return false;
    }
    const publishHeaders = { 'content-type': 'application/json', ...headers };
    try {
      const payload = typeof body === 'string' ? body : JSON.stringify(body);
      console.log('[STOMP] publish to:', destination, 'payload:', payload);
      client.publish({ destination, body: payload, headers: publishHeaders });
      return true;
    } catch (e) {
      console.error('useStomp: publish error', e);
      return false;
    }
  }, [isConnected]); // isConnected가 변경될 때만 재생성

  const publishOp = useCallback((opMessage) => {
    if (!groupId || !travelId) {
      console.warn('useStomp: missing groupId/travelId for op publish');
      return false;
    }
    const destination = `/app/group/${groupId}/travel/${travelId}/edit/op`;
    console.log('[STOMP] publishOp to:', destination, 'op:', opMessage);
    return publish({ destination, body: opMessage });
  }, [groupId, travelId, publish]);

  const joinEditSession = useCallback((userId) => {
    if (!groupId || !travelId) {
      console.warn('useStomp: missing groupId/travelId for join');
      return false;
    }
    const destination = `/app/group/${groupId}/travel/${travelId}/edit/join`;
    console.log('[STOMP] joinEditSession to:', destination, 'userId:', userId);
    return publish({
      destination,
      body: { userId }
    });
  }, [groupId, travelId, publish]);

  const refreshData = useCallback(() => {
    console.log('데이터 새로고침 요청 - 서버에 스냅샷 요청');
    if (onRefreshDataRef.current) {
      onRefreshDataRef.current();
    }
  }, []);

  // 자동 입장 로직
  useEffect(() => {
    if (autoJoin && isConnected && publish && groupId && travelId && !hasJoinedRef.current) {
      console.log('편집 세션 자동 입장');
      joinEditSession('currentUser'); // userId는 컴포넌트에서 전달받아야 함
      hasJoinedRef.current = true;
    }
  }, [isConnected, publish, groupId, travelId, autoJoin, joinEditSession]);

  // 컴포넌트 언마운트 시 자동 퇴장
  useEffect(() => {
    return () => {
      if (isConnected && publish && groupId && travelId) {
        console.log('편집 세션 자동 퇴장');
        WebsocketAPI.leaveEditSession(publish, groupId, travelId, 'currentUser');
      }
      hasJoinedRef.current = false;
    };
  }, []);

  return { isConnected, error, publish, publishOp, joinEditSession, refreshData, client: clientRef.current };
}