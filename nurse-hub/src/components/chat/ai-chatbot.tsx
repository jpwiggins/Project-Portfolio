import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Bot, MessageCircle, X, Send } from "lucide-react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      senderType: "ai",
      message: "Hi! I'm here to help with clinical questions, app navigation, or finding resources. What can I assist you with today?",
      createdAt: new Date().toISOString(),
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { sendMessage } = useWebSocket({
    url: `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`,
    onMessage: (data) => {
      if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
      }
    },
    enabled: isOpen,
    chatRoomId: 'ai_assistant',
    userId: user?.id,
  });

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
      chatRoomId: 'ai_assistant',
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

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="floating-chat">
      {isOpen && (
        <Card className="mb-4 w-80 h-96 flex flex-col shadow-2xl border border-gray-200">
          <CardHeader className="gradient-bg text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={16} />
                </div>
                <div>
                  <CardTitle className="text-white text-base">NurseBot AI</CardTitle>
                  <p className="text-xs opacity-90">Clinical Assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex items-start space-x-2 ${
                  msg.senderType === 'user' ? 'justify-end' : ''
                }`}
              >
                {msg.senderType === 'ai' && (
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-primary" size={12} />
                  </div>
                )}
                
                <div
                  className={`rounded-lg p-3 chat-bubble ${
                    msg.senderType === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                
                {msg.senderType === 'user' && (
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about protocols, drugs, or app features..."
                className="flex-1 text-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-primary text-white hover:bg-primary/90"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </Card>
      )}
      
      <Button
        onClick={toggleChat}
        className="bg-primary text-white w-14 h-14 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300"
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </Button>
    </div>
  );
}
