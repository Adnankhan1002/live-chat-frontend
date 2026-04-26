import { createSlice } from "@reduxjs/toolkit";


export const themeSlice=createSlice({
    name:"themeSlice",
     initialState : true,
    reducers:{
        changeTheme :(state)=>{
          return state = !state;
        },
    },
});
export const {changeTheme} = themeSlice.actions;

export default themeSlice.reducer;
