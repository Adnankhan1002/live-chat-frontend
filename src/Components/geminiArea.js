import React from "react";
import { useState,useEffect,useContext } from "react";
import axios from "axios";
import { myContext } from './MainContainer';
import {useSelector} from 'react-redux'
function Query() {
    const [data, setData] = useState(null);
   const { refresh, setRefresh } = useContext(myContext);
   const lightTheme=(useSelector((state)=>state.themeKey));
  
    useEffect(() => {
      const fetchTickerData = async () => {
        try {
          const response = await axios.get('http://localhost:5050/api/Gemini');
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data", error);
        }
      };
  
      fetchTickerData();
    }, [refresh]);
  
    return (
        <div className="screen-shell flex justify-center items-center p-5 w-3/4">
        <div className={"bot-card w-full max-w-4xl p-6 " + (lightTheme? "bg-white" : "dark") }>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Assistant</p>
              <div className={"font-bold text-3xl mb-2"+ (lightTheme? " text-slate-900" : " text-white")}>Ask me anything</div>
            </div>
          </div>
          <div className="overflow-y-auto no-scrollbar rounded-2xl p-5 bg-slate-50/80 min-h-[420px]">
            <p className={"text-base leading-8"+ (lightTheme? " text-slate-700" : " text-white")}>{data}</p>
          </div>
        </div>
        </div>
    );
  }
  
  export default   Query;