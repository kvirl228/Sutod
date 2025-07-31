import { useEffect, useState, useRef, useCallback } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import './Chat.css';

function Chat({ userId, user2Id, username }) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [inputText, setInputText] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clientRef = useRef(null);
  const isFirstLoad = useRef(true);
  const containerRef = useRef(null);
  const pageRef = useRef(0);

  // Получение или создание чата
  const fetchChatId = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/chats/twoId?id1=${userId}&id2=${user2Id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (response.ok) {
        const id = await response.text();
        return id;
      } 
      else{
        const createResponse = await fetch('http://localhost:8080/api/chats', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId,
            user2Id
          })
        });

        if (createResponse.ok) {
          alert("Хуй")
          return await createResponse.text();
        }
        else{
          alert("Член")
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      return null;
    }
  }, [userId, user2Id]);

  // Инициализация WebSocket
  const initWebSocket = useCallback((id) => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      onConnect: () => {
        setIsConnected(true);
        console.log("WebSocket connected");

        client.subscribe(`/topic/chat/${id}`, (message) => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [...prev, msg]);
        });

        // Подписка на персональные уведомления
        client.subscribe(`/user/queue/errors`, (message) => {
          console.error('Error:', message.body);
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  // Загрузка сообщений
  const loadMessages = useCallback(async (id, beforeTimestamp = null) => {
    setIsLoading(true);
    try {
      let url = `http://localhost:8080/api/messages/${beforeTimestamp ? 'load' : 'last'}/${id}`;
      if (beforeTimestamp) {
        url += `?before=${beforeTimestamp}`;
      }

      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        if (beforeTimestamp) {
          setMessages(prev => [...data, ...prev]);
          if (data.length === 0) setHasMore(false);
        } else {
          setMessages(data);
        }
        pageRef.current += 1;
      }
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Отправка сообщения
  const sendMessage = useCallback(() => {
    if (!inputText.trim() || !isConnected) return;

    clientRef.current.publish({
      destination: `/app/chat.send`,
      body: JSON.stringify({
        senderId: userId,
        chatId: chatId,
        text: inputText,
        timestamp: new Date().toISOString()
      }),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    setInputText('');
  }, [inputText, isConnected, chatId, userId]);

  // Основной эффект инициализации
  useEffect(() => {
    const initChat = async () => {
      const id = await fetchChatId();
      if (id) {
        setChatId(id);
        initWebSocket(id);
        loadMessages(id);
      }
    };

    initChat();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [fetchChatId, initWebSocket, loadMessages]);

  // Подгрузка старых сообщений при скролле
  const handleScroll = useCallback(() => {
    if (containerRef.current.scrollTop === 0 && !isLoading && hasMore && messages.length > 0) {
      loadMessages(chatId, messages[0].timestamp);
    }
  }, [isLoading, hasMore, messages, chatId, loadMessages]);

  // Автоскролл при новых сообщениях
  useEffect(() => {
    if (containerRef.current && !isFirstLoad.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    isFirstLoad.current = false;
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="userInfo_chat">
        <div className="userName_chat">{username}</div>
        <div className="connection-status">
          {isConnected ? 'Online' : 'Connecting...'}
        </div>
      </div>

      <div className="userInfo_chat" onScroll={handleScroll} ref={containerRef}>
        {isLoading && <div className="loading-indicator">Loading...</div>}
        {messages.map((msg, index) => (
          <div
            key={`${msg.timestamp}-${index}`}
            className={msg.senderId === userId ? 'my-message' : 'their-message'}
          >
            <div className="message-content">{msg.text}</div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="push_chat">
        <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Введите сообщение" className="input_chat"/>
        <button className="chat_button" onClick={sendMessage} disabled={!inputText.trim()}>Отправить</button>
      </div>
    </div>
  );
}

export default Chat;