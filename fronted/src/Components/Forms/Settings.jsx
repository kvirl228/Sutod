import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function Settings(props){

    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [newPassword, setNePassword] = useState('')

    const[user, setUser] = useState([])
    const navigate = useNavigate()

    let isUsername = <div></div>
    let isPassword = <div></div>
    const handleChangeName = (event) => {
        setName(event.target.value)
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleChangeNewPassword = (event) => {
        setNePassword(event.target.value)
    }

    async function refresh(){
        try {
        const response = await fetch("http://localhost:8080/auth/refresh", {
          method: "POST",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const token = await response.text()
          localStorage.setItem("token", token)
        } else {
        
        }
      } catch (error) {
      
      }
    }

    async function chageUsername () {
        try {
        const response = await fetch(`http://localhost:8080/api/users/${props.userId}/username`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({username: name}),
            mode: 'cors'
        });

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

    async function changePassword() {
        try {
        const response = await fetch(`http://localhost:8080/api/users/${props.userId}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                password1: password,
                password2: newPassword
            }),
            mode: 'cors'
        });

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

    function toChats(){
        navigate('/chats')
    }
    return(
        <div className="forms_block_settings">
            <form className="forms">
                <div className="settings_exit" onClick={toChats}>X</div>
                <div className="main_form_text">Вход</div>
                <div className="form_block">
                    <label className="form_label">Имя</label>
                    <input className="form_input" value = {name} onChange={handleChangeName} placeholder="Введите новое имя"/>
                    <button className="form_btn" onClick={() => chageUsername()} >Изменить</button>
                    {isUsername}
                </div>
                <div className="form_block">
                    <label className="form_label" >Пароль</label>
                    <input className="form_input" value={password} onChange={handleChangePassword} placeholder="введите текущий пароль"/>
                    <input className="form_input" value={newPassword} onChange={handleChangeNewPassword} placeholder="Введите нвый пароль"/>
                    <button className="form_btn" onClick={changePassword} >Изменит</button>
                    {isPassword}
                </div> 
            </form>
        </div>
    )

}

export default Settings;