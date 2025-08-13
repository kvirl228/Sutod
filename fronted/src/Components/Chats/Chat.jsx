import { useEffect, useState} from "react";
import './Chat.css';

function Chat({ userId, user2Id, username }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isClick, setIsClick] = useState(true)
  const [deleteId, setDeleteId] = useState(0)

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
        else{
          console.log("dsfads")
        }
      } 
      catch (error) {
        setTimeout(() => {
          subscribe()
        }, 1)
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

      
      if(response.ok){
            const message = await response.json()
            const newMessage = [...messages, message]
            setMessages(newMessage)
        }
        else{
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

  useEffect(() => {
    subscribe()
  }, [])


  return (
    <div className="chat-container">
      <div className="userInfo_chat">
        <div className="userName_chat">{username}</div>
        <div className="connection-status">
          
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={`${msg.timestamp}-${index}`} className={msg.senderId === userId ? 'my_message' : 'their_message'}>
            <div className="message-content" onClick={() => click(!isClick, msg.id)}>{msg.message}</div>
          </div>
        ))}
      </div>

      {isClick ?
        <div className="push_chat">
          <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Введите сообщение" className="input_chat"/>
          <button className="chat_button" onClick={sendMessage} disabled={!inputText.trim()}>Отправить</button>
        </div>
        :
        <div>
          <button className="chat_button" onClick={() => deleteMessage(deleteId)}>удалить</button>
        </div>
      }
      
    </div>
  );
}

export default Chat;