import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useQuery } from "@tanstack/react-query";
import { Send, Users, Circle } from "lucide-react";
import { format } from "date-fns";

interface NurseChatProps {
  chatRoomId: string;
  chatRoomName: string;
}

export default function NurseChat({ chatRoomId, chatRoomName }: NurseChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { data: chatHistory } = useQuery({
    queryKey: ["/api/chat/messages", chatRoomId],
    enabled: !!chatRoomId,
  });

  const { isConnected, sendMessage } = useWebSocket({
    url: `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`,
    onMessage: (data) => {
      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      }
    },
    enabled: !!chatRoomId,
    chatRoomId,
    userId: user?.id,
  });

  useEffect(() => {
    if (Array.isArray(chatHistory)) {
      setMessages([...chatHistory].reverse());
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !sendMessage) return;

    const userMessage = {
      id: Date.now().toString(),
      chatRoomId,
      senderId: user?.id,
      senderType: 'user',
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessage({
      type: 'message',
      message: message.trim(),
      messageType: 'text',
    });
    setMessage("");
  };

  const onlineUsers = [
    { id: "1", name: "Sarah Johnson", unit: "ICU", status: "online" },
    { id: "2", name: "Mike Chen", unit: "Emergency", status: "online" },
    { id: "3", name: "Lisa Rodriguez", unit: "ICU", status: "away" },
    { id: "4", name: "David Kim", unit: "Surgery", status: "busy" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'busy': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-primary/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-text-primary">{chatRoomName}</h3>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Circle className={`w-2 h-2 fill-current ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                <span>•</span>
                <span>{onlineUsers.filter(u => u.status === 'online').length} online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isOwnMessage = msg.senderId === user?.id;
              const showAvatar = !isOwnMessage && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);
              
              return (
                <div
                  key={msg.id || index}
                  className={`flex items-start space-x-3 ${isOwnMessage ? 'justify-end' : ''}`}
                >
                  {!isOwnMessage && (
                    <Avatar className={`w-8 h-8 ${showAvatar ? '' : 'invisible'}`}>
                      <AvatarFallback className="text-xs">
                        {msg.senderName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-first' : ''}`}>
                    {showAvatar && !isOwnMessage && (
                      <div className="text-xs text-text-secondary mb-1">
                        {msg.senderName || 'Unknown User'}
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        isOwnMessage
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-text-primary'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-primary-foreground/70' : 'text-text-secondary'
                      }`}>
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={!isConnected}
            />
            <Button
              type="submit"
              disabled={!message.trim() || !isConnected}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>

      {/* Online Users Sidebar */}
      <div className="w-64 border-l border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-text-primary flex items-center space-x-2">
            <Users size={16} />
            <span>Team Members</span>
          </h4>
        </div>
        
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Circle className={`absolute -bottom-1 -right-1 w-3 h-3 fill-current ${getStatusColor(user.status)} bg-white rounded-full`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user.name}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {user.unit}
                    </Badge>
                    <span className={`text-xs ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
