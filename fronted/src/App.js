import Registration from "./Components/Forms/Registration";
import Login from "./Components/Forms/Login";
import Chats from "./Components/Chats/Menu";
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Settings from "./Components/Forms/Settings";
import Group from "./Components/Forms/Group";

function App() {
  return (
    <>
      <Routes>
          <Route path="/" element={<Registration/>}/>
          <Route path="/login" element={<Login/>}/> 
          <Route path="/chats" element={<Chats/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/group" element={<Group/>}/>
        </Routes>
    </>
  );
}

export default App;