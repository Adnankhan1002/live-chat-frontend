import React, { useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
function CreateGroups(){
  const navigate = useNavigate()
    
    const [open,setOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const userData = JSON.parse(localStorage.getItem('userData'))
     const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
      const User = userData.data;
    
   const createGroup= ()=>{
    const config = {
      headers:{
        Authorization : `Bearer ${User.token}`,
        'Content-Type': 'application/json',
      }
    }
  
      axios.post(apiUrl('/chat/createGroup'),
        {
            name: groupName, 
            users: ["675eabdc98f9525a9ad613d1","675eaa66a40291da9783b359"]
        },config
      ).then(response => {
        console.log('group created at post', response);
        navigate('/app/Available');
      }).catch(err => {
        console.error('Error creating group:', err);
      });
      
   
    
   } 
    
    return(
      <div className="group-panel flex justify-center items-center h-screen w-4/5">
<div className="w-full max-w-2xl surface-panel p-6 rounded-3xl flex flex-col gap-6">
    <div>
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500 mb-2">Group creator</p>
      <h2 className="text-3xl font-bold text-slate-900">Create a new group space</h2>
      <p className="text-slate-500 mt-2">Pick a name and confirm. Members can join from the available groups view.</p>
    </div>
    <div className="flex flex-col md:flex-row justify-center items-center gap-3 w-full">
    <input type='text' placeholder='Enter your Group Name'className="w-full md:w-3/4 h-14 rounded-2xl p-4 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"  onChange={(e) => {
            setGroupName(e.target.value);
          }}></input>
    <button variant="outlined" onClick={handleClickOpen} className="bg-slate-900 text-white h-14 px-6 rounded-2xl hover:bg-cyan-600 active:bg-slate-900 transition-colors font-semibold">Create</button>
</div>
  
<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
        {"Do you want to create a Group Named " + groupName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          This will create a group in which you will be the admin and others will be able to join this group.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={()=>{
             createGroup();
            handleClose();
           
          }} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
</div>
      </div>
      
       
    );
}
export default CreateGroups;
