import {useState,createContext} from "react";
import runChat from "../configure/configure.js";
export const Context = createContext();
const ContextProvider = (props) => {
     const [input,setInput] = useState("");
     const [recentPrompt,setRecentPrompt] = useState("");
     const [resultData,setResultData] = useState("");
     const [previousPrompts,setPreviousPrompts] = useState([]);
     const [showResult,setShowResult] = useState(false);
     const [loading,setLoading] = useState(false);
     const delayParagraph = (index,nextWord) => {
          setTimeout(function (){
               setResultData(previous => previous + nextWord);
          },75 * index);
     };
     const newChat = () => {
          setLoading(false);
          setShowResult(false);
     }
     const onSent = async (prompt) => {
          setResultData("");
          setLoading(true);
          setShowResult(true);
          let response;
          if(prompt !== undefined){
               response = await runChat(prompt);
               setRecentPrompt(prompt);
          }else{
               setPreviousPrompts(previous => [...previous,input]);
               setRecentPrompt(input);
               response = await runChat(input);
          }
          let responseArray = response.split('**');
          let newResponse1 = "";
          for(let i = 0;i < responseArray.length;i++){
               if(i === 0 || i % 2 !== 1){
                    newResponse1 += responseArray[i];
               }else{
                    newResponse1 += `<b>${responseArray[i]}</b>`;
               }
          }
          let newResponse2 = newResponse1.split('*').join('</br>');
          let newResponseArray = newResponse2.split(" ");
          for(let i = 0;i < newResponseArray.length;i++){
               const nextWord = newResponseArray[i];
               delayParagraph(i,nextWord+" ");
          }
          setLoading(false);
          setInput("");
     };
     const contextValue = {
          previousPrompts,setPreviousPrompts,onSent,recentPrompt,setRecentPrompt,showResult,
          loading,resultData,input,setInput,newChat
     };
     return (
          <Context.Provider value={contextValue}>
               {props.children}
          </Context.Provider>
     );
};
export default ContextProvider;