import {useState,useContext} from 'react';
import {assets} from '../../assets/assets.js';
import {Context} from '../../context/context.jsx';
import './sidebar.css';
const Sidebar = () => {
     const [extended,setExtended] = useState(false);
     const {onSent,previousPrompts,setRecentPrompt,newChat} = useContext(Context);
     const loadPrompt = async (prompt) => {
          setRecentPrompt(prompt);
          await onSent(prompt);
     }
     return (
          <div className="sidebar">
               <div className='top'>
                    <img
                         className='menu'
                         src={assets.menu_icon}
                         onClick={() => setExtended(previous => !previous)}
                         alt=''
                    />
                    <div className='new-chat' onClick={() => newChat()}>
                         <img src={assets.plus_icon} alt=''/>
                         {extended ? <p>new chat</p> : null}
                    </div>
                    {extended ?
                         <div className='recent'>
                              <p className='recent-title'>recent</p>
                              {previousPrompts.map((item,index) => {
                                   return (
                                        <div className='recent-entry' onClick={() => loadPrompt(item)}>
                                             <img src={assets.message_icon} alt=''/>
                                             <p key={index}>{item.slice(0,18)} ....</p>
                                        </div>
                                   );
                              })}
                         </div> : null
                    }
               </div>
               <div className='bottom'>
                    <div className='bottom-item recent-entry'>
                         <img src={assets.question_icon} alt=''/>
                         {extended ? <p>help</p> : null}
                    </div>
                    <div className='bottom-item recent-entry'>
                         <img src={assets.history_icon} alt=''/>
                         {extended ? <p>activity</p> : null}
                    </div>
                    <div className='bottom-item recent-entry'>
                         <img src={assets.setting_icon} alt=''/>
                         {extended ? <p>settings</p> : null}
                    </div>
               </div>
          </div>
     );
};
export default Sidebar;