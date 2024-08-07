import {useContext} from 'react';
import {assets} from '../../assets/assets.js';
import {Context} from '../../context/context.jsx';
import './main.css';
const Main = () => {
     const {onSent,recentPrompt,showResult,loading,resultData,input,setInput} = useContext(Context);
     return (
          <div className='main'>
               <div className='nav'>
                    <p>gemini</p>
                    <img src={assets.user_icon} alt=''/>
               </div>
               <div className='main-container'>
                    {!showResult ?
                         <>
                              <div className='greet'>
                                   <p><span>hello, zim.</span></p>
                                   <p>how can i help you today?</p>
                              </div>
                              <div className='cards'>
                                   <div className='card'>
                                        <p>suggest beautiful places to see on an upcoming road trip</p>
                                        <img src={assets.compass_icon} alt=''/>
                                   </div>
                                   <div className='card'>
                                        <p>briefly summarize this concept: urban planning</p>
                                        <img src={assets.bulb_icon} alt=''/>
                                   </div>
                                   <div className='card'>
                                        <p>brainstorm team bonding activities for our work retreat</p>
                                        <img src={assets.message_icon} alt=''/>
                                   </div>
                                   <div className='card'>
                                        <p>improve the readability of the following code</p>
                                        <img src={assets.code_icon} alt=''/>
                                   </div>
                              </div>
                         </> :
                         <div className='result'>
                              <div className='result-title'>
                                   <img src={assets.user_icon} alt=''/>
                                   <p>{recentPrompt}</p>
                              </div>
                              <div className='result-data'>
                                   <img src={assets.gemini_icon} alt=''/>
                                   {loading ?
                                        <div className='loader'>
                                             <hr/>
                                             <hr/>
                                             <hr/>
                                        </div> :
                                        <p dangerouslySetInnerHTML={{__html: resultData}}></p>
                                   }
                              </div>
                         </div>
                    }
                    <div className='main-bottom'>
                         <div className='search-box'>
                              <input
                                   type='text'
                                   value={input}
                                   onChange={(event) => setInput(event.target.value)}
                                   placeholder='enter a prompt  here'/>
                              <div>
                                   <img src={assets.gallery_icon} alt=''/>
                                   <img src={assets.mic_icon} alt=''/>
                                   {input ?
                                        <img src={assets.send_icon} onClick={() => onSent()} alt=''/>
                                        : null
                                   }
                              </div>
                         </div>
                         <div className='bottom-info'>gemini may display inaccurate info, including about people, so double-check its responsive. your privacy and gemini app</div>
                    </div>
               </div>
          </div>
     );
};
export default Main;