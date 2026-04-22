import { useEffect, useRef, useState } from 'react';

interface UseWebSocketProps {
  url: string;
  onMessage?: (data: any) => void;
  enabled?: boolean;
  chatRoomId?: string;
  userId?: string;
}

export function useWebSocket({
  url,
  onMessage,
  enabled = true,
  chatRoomId,
  userId,
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    if (!enabled || !userId) return;

    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        
        // Join the chat room
        if (chatRoomId && userId) {
          ws.current?.send(JSON.stringify({
            type: 'join',
            chatRoomId,
            userId,
          }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        if (enabled) {
          reconnectTimeoutRef.current = setTimeout(connect, 3000);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  const sendMessage = (data: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close();
    }
  };

  useEffect(() => {
    if (enabled && userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, userId, chatRoomId]);

  return {
    isConnected,
    sendMessage: isConnected ? sendMessage : null,
    disconnect,
  };
}
