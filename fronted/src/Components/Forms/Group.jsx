import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Group(props){

    const [groupName, setGroupName] = useState('')
    // const [usersToAdd, setUsersToAdd] = useState([])
    const[user, setUser] = useState([])
    const [userid, setuserId] = useState(-1)
    

    const navigate = useNavigate()

    const handleGroupName = (event) => {
        setGroupName(event.target.value)
    }

    // const handle = (event) => {
    //     setUsersToAdd(event.target.value)
    // }

    async function refresh(){
        try {
        const response = await fetch("http://localhost:8080/auth/refresh", {
          method: "POST",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json"
          },
          // mode: 'cors'
        });

        if (response.ok) {
          const token = await response.text()
          localStorage.setItem("token", token)
        } else {
        
        }
      } catch (error) {
      
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
                if (await refresh()) {
                    return await getUserId()
                }
            }
            return null
        } catch (error) {
            console.error('Ошибка:', error);
            return null
        }
    }

    async function createGroup () {
        try {
        const response = await fetch(`http://localhost:8080/api/groups/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                groupName: groupName,
                creatorId: userid,   
            }),
        }
        );
        if(response.ok){
            await refresh()
            alert("YRAAAAAAAAA")
        }
        else{
            alert("Eror")
        }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    useEffect(() => {
        const init = async () => {
            const id = await getUserId()
        }
        init()
    }, [])

    function toChats(){
        navigate('/chats')
    }
    return(
        <div className="forms_block_settings">
            <form className="forms">
                <div className="settings_exit" onClick={toChats}>X</div>
                <div className="main_form_text">Создать группу</div>
                <div className="form_block">
                    <label className="form_label">Название группы</label>
                    <input className="form_input" value = {groupName} onChange={handleGroupName} placeholder="Введите название группы"/>
                    <button className="form_btn" onClick={(e) => { e.preventDefault(); createGroup(); }} >Создать</button>
                </div>
            </form>
        </div>
    )

}

export default Group;