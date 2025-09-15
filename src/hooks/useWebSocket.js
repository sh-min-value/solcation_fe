import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url, options = {}) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [error, setError] = useState(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = options.maxReconnectAttempts || 5;
    const reconnectInterval = options.reconnectInterval || 3000;

    useEffect(() => {
        const connect = () => {
            try {
                const ws = new WebSocket(url);
                
                ws.onopen = () => {
                    console.log('WebSocket 연결됨');
                    setIsConnected(true);
                    setError(null);
                    reconnectAttempts.current = 0;
                };

                ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        setLastMessage(data);
                    } catch (err) {
                        console.error('메시지 파싱 오류:', err);
                        setLastMessage(event.data);
                    }
                };

                ws.onclose = (event) => {
                    console.log('WebSocket 연결 종료:', event.code, event.reason);
                    setIsConnected(false);
                    
                    // 정상 종료가 아닌 경우 재연결 시도
                    if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
                        reconnectAttempts.current++;
                        console.log(`재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts}`);
                        
                        reconnectTimeoutRef.current = setTimeout(() => {
                            connect();
                        }, reconnectInterval);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket 오류:', error);
                    setError(error);
                };

                setSocket(ws);
            } catch (err) {
                console.error('WebSocket 연결 실패:', err);
                setError(err);
            }
        };

        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (socket) {
                socket.close(1000, '컴포넌트 언마운트');
            }
        };
    }, [url]);

    const sendMessage = (message) => {
        if (socket && isConnected) {
            try {
                const data = typeof message === 'string' ? message : JSON.stringify(message);
                socket.send(data);
                return true;
            } catch (err) {
                console.error('메시지 전송 실패:', err);
                setError(err);
                return false;
            }
        }
        return false;
    };

    const disconnect = () => {
        if (socket) {
            socket.close(1000, '사용자 요청');
        }
    };

    return {
        socket,
        isConnected,
        lastMessage,
        error,
        sendMessage,
        disconnect
    };
};

export default useWebSocket;
