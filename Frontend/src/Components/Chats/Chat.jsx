import { useEffect, useState } from "react";
import './Chat.css';

function Chat({ userId, user2Id, username }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isClick, setIsClick] = useState(true)
  const [deleteId, setDeleteId] = useState(0)
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isContact, setIsContact] = useState(false);

  const refreshToken = async () => {
    try {
      const response = await fetch("http://localhost:8080/auth/refresh", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });

      if (response.ok) {
        const token = await response.text()
        localStorage.setItem("token", token)
        return true
      }

      return false
    } catch (error) {

      return false
    }
  }
  const subscribe = async () => {

    try {
      const response = await fetch(`http://localhost:8080/api/messages/twoId?id1=${userId}&id2=${user2Id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([])
        setMessages(prevMessages => [...prevMessages, ...data]);
        setTimeout(() => {
          subscribe()
        }, 1500)

      }
      else if (response.status === 401) {
        if (await refreshToken()) {
          return await subscribe()
        }
      }
      else {
        console.log("dsfads")
      }
    }
    catch (error) {
      setTimeout(() => {
        subscribe()
      }, 1)
    }
  }

  const checkContact = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/contacts/find?id1=${userId}&id2=${user2Id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.id)  
        console.log("есть контакт")
        setIsContact(true)
      }
      else {
        console.log("нет контакта")
        setIsContact(false)
      }
    }
    catch (error) {
      console.log("error contact", error)
    }
  }

  const sendMessage = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/send/${user2Id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: inputText,
          senderId: userId,
        })
      });


      if (response.ok) {
        const message = await response.json()
        const newMessage = [...messages, message]
        setMessages(newMessage)
      }
      else {
        alert("Eror")
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }

    setInputText('')
  }

  const deleteMessage = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setIsClick(true)
        subscribe()
      }

      return false
    } catch (error) {

      return false
    }
  }

  const click = (clicker, id) => {
    setIsClick(clicker)
    setDeleteId(id)
  }

  const handleUsernameClick = async () => {
    checkContact();
    setShowUserPopup(true);
    setUserInfo({
      username: username,
      online: true,
      bio: 'Тестовый пользователь'
    });

    // Оставляем оригинальную логику закомментированной для тестирования
    /*
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user2Id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Ответ от сервера:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('Данные пользователя:', userData);
        setUserInfo(userData);
        setShowUserPopup(true);
        
        // Проверяем, есть ли пользователь в контактах
        const contactsResponse = await fetch(`http://localhost:8080/api/contacts/check/${user2Id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (contactsResponse.ok) {
          const contactStatus = await contactsResponse.json();
          setIsContact(contactStatus.isContact);
        }
      } else if (response.status === 401) {
        if (await refreshToken()) {
          handleUsernameClick();
        }
      } else {
        console.log('Ошибка при получении данных пользователя:', response.status);
      }
    } catch (error) {
      console.error('Ошибка при получении информации о пользователе:', error);
    }
    */
  }

  const addToContacts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/contacts/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          contactId: user2Id,
        })
      });


      if (response.ok) {
        alert("yes")
      }
      else {
        alert("Eror")
      }
    } catch (error) {
      alert(error)
    }
  }

  const removeFromContacts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users/contacts/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          contactId: user2Id,
        })
      });
      if (response.ok) {
        setIsContact(false)
        alert("yes")
      }
      else {
        alert("Eror")
      }
    } catch (error) {
      alert(error)
    }
  }

  const closeUserPopup = () => {
    setShowUserPopup(false);
    setUserInfo(null);
  }

  useEffect(() => {
    subscribe()
  }, [])


  return (
    <div className="chat-container">
      {/* Заголовок чата */}
      <div className="chat-header">
        <div className="chat-header-info" onClick={handleUsernameClick}>
          <div className="chat-user-avatar">
            {userInfo?.avatar ? (
              <img src={userInfo.avatar} alt="Avatar" />
            ) : (
              <span className="avatar-placeholder">👤</span>
            )}
            <div className="online-indicator">
              {userInfo?.online ? '🟢' : '⚪'}
            </div>
          </div>
          <div className="chat-user-info">
            <h3 className="chat-username">{username}</h3>
            <p className="chat-status">
              {userInfo?.online ? 'В сети' : 'Не в сети'}
            </p>
          </div>
        </div>
        <div className="chat-header-actions">
          <button className="chat-action-btn" title="Поиск">
            <span className="action-icon">🔍</span>
          </button>
          <button className="chat-action-btn" title="Настройки">
            <span className="action-icon">⚙️</span>
          </button>
        </div>
      </div>

      {/* Контейнер сообщений */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <h3>Начните разговор</h3>
            <p>Отправьте первое сообщение, чтобы начать общение с {username}</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div
                key={`${msg.timestamp}-${index}`}
                className={`message-wrapper ${msg.senderId === userId ? 'my_message' : 'their_message'}`}
              >
                <div className="message-bubble" onClick={() => click(!isClick, msg.id)}>
                  <div className="message-content">{msg.message}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {msg.senderId === userId && (
                    <div className="message-status">
                      {msg.read ? '✓✓' : '✓'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Панель ввода сообщений */}
      {isClick ? (
        <div className="chat-input-panel">
          <div className="input-container">
            <button className="attachment-btn" title="Прикрепить файл">
              <span className="attachment-icon">📎</span>
            </button>
            <div className="input-wrapper">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Введите сообщение..."
                className="chat-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (inputText.trim()) {
                      sendMessage();
                    }
                  }
                }}
              />
              <button className="emoji-btn" title="Эмодзи">
                <span className="emoji-icon">😊</span>
              </button>
            </div>
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!inputText.trim()}
              title="Отправить"
            >
              <span className="send-icon">📤</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="delete-panel">

          <button className="delete-btn" onClick={() => deleteMessage(deleteId)}>
            <span className="delete-icon">🗑️</span>
            Удалить сообщение
          </button>
          <button className="cancel-btn" onClick={() => setIsClick(true)}>
            Отмена
          </button>

          <div className="input-wrapper">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Введите сообщение..."
              className="chat-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputText.trim()) {
                    sendMessage();
                  }
                }
              }}
            />
            <button className="emoji-btn" title="Эмодзи">
              <span className="emoji-icon">😊</span>
            </button>
          </div>
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={!inputText.trim()}
            title="Отправить"
          >
            <span className="send-icon">📤</span>
          </button>
        </div>
      )}

      {/* Выпадающее окно с информацией о пользователе */}
      {showUserPopup && (
        <div className="user-popup-overlay" onClick={closeUserPopup}>
          <div className="user-popup" onClick={(e) => e.stopPropagation()}>
            <div className="user-popup-header">
              <div className="user-popup-avatar">
                {userInfo?.avatar ? (
                  <img src={userInfo.avatar} alt="Avatar" />
                ) : (
                  <div className="user-popup-avatar-placeholder">👤</div>
                )}
              </div>
              <div className="user-popup-info">
                <h3 className="user-popup-name">{userInfo?.username || username}</h3>
                <p className="user-popup-status">
                  {userInfo?.online ? '🟢 В сети' : '⚪ Не в сети'}
                </p>
              </div>
              <button className="user-popup-close" onClick={closeUserPopup}>✕</button>
            </div>

            <div className="user-popup-content">
              {userInfo?.bio && (
                <div className="user-popup-bio">
                  <h4>О себе:</h4>
                  <p>{userInfo.bio}</p>
                </div>
              )}

              <div className="user-popup-actions">
                {isContact ? (
                  <button className="user-popup-button remove-contact" onClick={removeFromContacts}>
                    🗑️ Удалить из контактов
                  </button>
                ) : (
                  <button className="user-popup-button add-contact" onClick={addToContacts}>
                    👥 Добавить в контакты
                  </button>
                )}

                <button className="user-popup-button send-message" onClick={closeUserPopup}>
                  💬 Написать сообщение
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;