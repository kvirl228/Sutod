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
    const [userGroups, setUserGroups] = useState([])
    const [userChannels, setUserChannels] = useState([])
    const [activeCategory, setActiveCategory] = useState('chats') // 'chats', 'groups', 'channels'
    const [selectedChatId, setSelectedChatId] = useState(null) // ID выбранного чата/группы/канала

    const handleChange = (e) => {
        setSearch(e.target.value)
        if (e.target.value.trim() === '') {
            setSearchCheck(true)
            setSelectedChatId(null) // Сбрасываем выбранный чат при очистке поиска
        }
    }

    const toSettings = () => navigate("/settings")
    const toGroupCreate = () => navigate("/group")

    const clickChat = (value, id, name) => {
        if (selectedChatId === id) {
            console.log('Deselecting chat:', id)
            setSelectedChatId(null)
            setUser2Id(id)
            setUsername(null)
            setIsClick(true)
        } else {
            console.log('Selecting new chat:', id)
            setIsClick(!value)
            setUser2Id(id)
            setUsername(name)
            setSelectedChatId(id)
        }
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

    const switchCategory = (category) => {
        setActiveCategory(category)
        setSearchCheck(true) 
        setSelectedChatId(null) 
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
                console.log('Chats:', data)
                setActiveCategory('chats') // Устанавливаем активную категорию
            } 
            else if (response.status === 401) {
                if (await refreshToken()) {
                    await getAllChats(id)
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке чатов:', error);
        }
    }

    const getAllGroups = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUserGroups(Array.isArray(data) ? data : [data])
                console.log('Groups:', data)
                setActiveCategory('groups') // Устанавливаем активную категорию
            } 
            else if (response.status === 401) {
                if (await refreshToken()) {
                    await getAllGroups(id)
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке групп:', error);
        }
    }

    const getAllChannels = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/channels/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUserChannels(Array.isArray(data) ? data : [data])
                console.log('Channels:', data)
                setActiveCategory('channels') // Устанавливаем активную категорию
            } 
            else if (response.status === 401) {
                if (await refreshToken()) {
                    await getAllChannels(id)
                }
            }
        } catch (error) {
            console.error('Ошибка при загрузке каналов:', error);
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
                    <button className="search_button" onClick={searchUser}>
                        <span className="search_icon">🔍</span>
                    </button>
                </div>

                <div className="folder">
                    {!searchCheck ? (
                        // Поиск пользователей
                        userInfo.map((user, index) => (
                            <ChatInfo
                                key={index}
                                name={user.name}
                                text=""
                                time=""
                                func={() => clickChat(isClick, user.id, user.name)}
                                isSelected={selectedChatId === user.id}
                                chatId={user.id}
                            />
                        ))
                    ) : (
                        // Отображаем данные в зависимости от активной категории
                        <>
                            {activeCategory === 'chats' && userChats.map((item, index) => (
                                <ChatInfo
                                    key={index}
                                    name={item.name}
                                    text={item.lastMessage?.text || ""}
                                    time={item.lastMessage?.timestamp || ""}
                                    func={() => clickChat(isClick, item.user2Id, item.name)}
                                    isSelected={selectedChatId === item.user2Id}
                                    chatId={item.user2Id}
                                />
                            ))}
                            {activeCategory === 'groups' && userGroups.map((item, index) => (
                                <ChatInfo
                                    key={index}
                                    name={item.name || item.groupName || "Группа"}
                                    text={item.description || ""}
                                    time=""
                                    func={() => clickChat(isClick, item.id, item.name || item.groupName)}
                                    isSelected={selectedChatId === item.id}
                                    chatId={item.id}
                                />
                            ))}
                            {activeCategory === 'channels' && userChannels.map((item, index) => (
                                <ChatInfo
                                    key={index}
                                    name={item.name || item.channelName || "Канал"}
                                    text={item.description || ""}
                                    time=""
                                    func={() => clickChat(isClick, item.id, item.name || item.channelName)}
                                    isSelected={selectedChatId === item.id}
                                    chatId={item.id}
                                />
                            ))}
                        </>
                    )}
                </div>
                {!selectedChatId && (
                    <div className="create_buttons">
                        <button 
                            className="create_button group_create"
                            onClick={toGroupCreate}
                            title="Создать группу"
                        >
                            <span className="create_icon">👥</span>
                            <span className="create_text">Группа</span>
                        </button>
                        <button 
                            className="create_button channel_create"
                            onClick={() => navigate("/channel")}
                            title="Создать канал"
                        >
                            <span className="create_text">📢</span>
                            <span className="create_text">Канал</span>
                        </button>
                    </div>
                )}
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
            
            <div className="data_buttons">
                <button 
                    className={`data_button ${activeCategory === 'chats' ? 'active' : ''}`}
                    onClick={() => {
                        switchCategory('chats')
                        getAllChats(userid)
                    }}
                >
                    Чаты ({userChats.length})
                </button>
                <button 
                    className={`data_button ${activeCategory === 'groups' ? 'active' : ''}`}
                    onClick={() => {
                        switchCategory('groups')
                        getAllGroups(userid)
                    }}
                >
                    Группы ({userGroups.length})
                </button>
                <button 
                    className={`data_button ${activeCategory === 'channels' ? 'active' : ''}`}
                    onClick={() => {
                        switchCategory('channels')
                        getAllChannels(userid)
                    }}
                >
                    Каналы ({userChannels.length})
                </button>
            </div>
        </div>
    )
}

export default Chats;