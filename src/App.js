import React from 'react';
import MainContainer from "./Components/MainContainer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LogIn from './Components/Login';
import { Route, Routes } from 'react-router-dom';
import Welcome from './Components/welcome';
import Users from './Components/Users';
import CreateGroup from './Components/createGroups';
import Chatarea from './Components/ChatArea';
import AvailGroups from './Components/available_grp';
import Query from './Components/geminiArea';
import WhiteBoard from './Components/whiteboardSharing/whiteBoard';
import RoomPage from './Components/whiteboardSharing/roomPage';

function App() {
  return (
    <div className="App flex justify-center items-center min-h-screen bg-black">
     {/*<MainContainer /> */} 
      {/*<LogIn/>*/}
      <Routes>
        <Route path='/' element={<LogIn/>}/>
         <Route path = 'whiteboard' element = {<WhiteBoard/>}/>
       
        <Route path='app' element={<MainContainer/>}>
           <Route path='welcome' element={<Welcome/>}/>
           <Route path='user' element={<Users/>}/>
           <Route path='group' element={<CreateGroup/>}/>
           <Route path='chat/:_id' element={<Chatarea/>}/>
          <Route path='Available'element={<AvailGroups/>}/>
          <Route path='Gemini' element = {<Query/>}/>
          <Route path = 'room' element = {<RoomPage/>}/>
         

          
          


        </Route>

      </Routes>
    </div>
  );
}

export default App;
