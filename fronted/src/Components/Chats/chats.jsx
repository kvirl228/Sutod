import { useCallback, useEffect, useState } from 'react';
import './Chat.css'
import ChatInfo from './Chat_info';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';

function Chats() {
    const navigate = useNavigate()
    const [searchCheck, setSearchCheck] = useState(true)
    const [isClick, setIsClick] = useState(true)
    const [userid, setuserId] = useState(-1)
    const [user2Id, setUser2Id] = useState(-1)
    const [username, setUsername] = useState('')
    const [search, setSearch] = useState('')
    const [userInfo, setUserInfo] = useState([])
    const [userChats, setUserChats] = useState([])

    const handleChange = (e) => {
        setSearch(e.target.value)
        if (e.target.value.trim() === '') {
            setSearchCheck(true)
        }
    }

    const toSettings = () => navigate("/settings")

    const clickChat = (value, id, name) => {
        setIsClick(!value)
        setUser2Id(id)
        setUsername(name)
    }

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
            navigate('/')
            return false
        } catch (error) {
            navigate('/')
            return false
        }
    }

    const searchUser = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/${search}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserInfo([data])
                setSearchCheck(false)
            } else if (response.status === 401) {
                if (await refreshToken()) {
                    await searchUser()
                }
            } else {
                setSearchCheck(true)
            }
        } catch (error) {
            setSearchCheck(true)
            console.error('Ошибка:', error);
        }
    }

    const getUserId = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/users/id/${localStorage.getItem("token")}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setuserId(data)
                return data
            } else if (response.status === 401) {
                if (await refreshToken()) {
                    return await getUserId()
                }
            }
            return null
        } catch (error) {
            console.error('Ошибка:', error);
            return null
        }
    }

    const getAllChats = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/chats/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUserChats(Array.isArray(data) ? data : [data])
                console.log(data)
            } 
            else if (response.status === 401) {
                if (await refreshToken()) {
                    await getAllChats(id)
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    useEffect(() => {
        const init = async () => {
            const id = await getUserId()
            if (id) {
                await getAllChats(id)
            }
        }
        init()
    }, [])

    return (
        <div className='chats_block'>
            <div className="folder_block">
                <div className="user_block">
                    <div className="user_folder_photo" onClick={toSettings}></div>
                    <input className="user_folder_search" placeholder='Поиск' value={search} onChange={handleChange}/>
                    <button onClick={searchUser}>src</button>
                </div>

                <div className="folder">
                    {searchCheck ? 
                        userChats.map((item, index) => (
                            <ChatInfo
                                key={index}
                                name={item.username}
                                text={item.lastMessage?.text || ""}
                                time={item.lastMessage?.timestamp || ""}
                                func={() => clickChat(isClick, item.user2Id, item.username)}
                            />
                        ))
                        : 
                        userInfo.map((user, index) => (
                            <ChatInfo
                                key={index}
                                name={user.username}
                                text=""
                                time=""
                                func={() => clickChat(isClick, user.id, user.username)}
                            />
                        ))
                    }
                </div>
            </div>
            <div className='chat_block'>
                {!isClick && (
                    <Chat
                        userId={userid}
                        user2Id={user2Id}
                        username={username}
                    />
                )}
            </div>
        </div>
    )
}

export default Chats;