import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client'
import axios from "axios"
import {nanoid} from "nanoid"
import { useEffect, useInsertionEffect, useState } from 'react';
import {FaPowerOff} from "react-icons/fa";
import {AiOutlineInfoCircle} from "react-icons/ai";
import {AiOutlineSend} from "react-icons/ai";
import {MdInsertPhoto} from "react-icons/md";
import {MdSend} from "react-icons/md";
import {AiOutlineClose} from "react-icons/ai";


const url1="https://letschat99.herokuapp.com/"
const url2="http://localhost:3009/"


const socket = io.connect(url1)
// const socket = io.connect("https://letschat99.herokuapp.com/")
// const userName=nanoid(4)
// const userName="atishyadav"
const url="http://localhost:3009/userdata/login"
function App() {

  const [message,setMessage]=useState('')
  const [prevChat,setPrevChat]=useState([])
  const [chat,setChat]=useState([])
  const [userName,setUserName]=useState('')
  const [name,setName]=useState('')
  const [password,setPassword]=useState('')
  const [login,setLogin]=useState(2);
  const [logout,setLogout]=useState(0);
  const [imageupload,setImageupload]=useState(0)
  
  const [refresh,setRefresh]=useState(0)

  const [customToken,setCustomToken]=useState('');
  const [printval,setPrintval]=useState('');


  // const tokenval=JSON.parse(localStorage.getItem("tokendata"))

  const userlogin = async ()=>{
    // setUserName()
    console.log("LOGIN STARTED...")
    setUserName(name)
    setPassword(password)
     
     var fetchToken='  ';
      
      const result = await axios( 
       `${url2}userdata/login?userName=${name}&password=${password}`
      )
     
     console.log(result)
     console.log(result.data)
     fetchToken=result.data.token
   
window.localStorage.setItem("tokendata",JSON.stringify(fetchToken));
console.log(result.data.token)

  }

   
   useEffect(()=>{


    const tokenvalue=JSON.parse(localStorage.getItem("tokendata"))
    // console.log(tokenvalue)

    const valid = async () => {
      const result = await axios( 
       `${url1}userdata/loggedin?token=${tokenvalue}`
      )
    //  console.log(result.data)
     if(result.data.user!=='not verified'){
        setLogin(1);
        setUserName(result.data.user)
     }else setLogin(0)
     

      }
      if(tokenvalue!==null){
        valid();
      }else setLogin(0)
        

    // console.log(tokenvalue)
    
   },[logout])


   const sendChat=(e)=>{
    e.preventDefault()

    //Here we will create post route
    if(message!==''){
      socket.emit("chat",{message,userName})
      setMessage('')
    }
    
   }

   useEffect(()=>{
       
  const tokenval=JSON.parse(localStorage.getItem("tokendata"))

      const getchat = async () => {
          const result = await axios(`${url1}chat/get?token=${tokenval}`)

          // console.log("I AM THE CHAT "+JSON.stringify(result.data))
          setPrevChat(result.data)
          //  console.log(prevChat)    
        } 
        getchat();
   
   },[])

   useEffect(()=>{
    socket.on("chat",(payload)=>{
      setChat([...chat,payload])
    })
   })
   
    useEffect(()=>{
       console.log("updated")
    },[refresh])

 

  function deleteToken(){
    // localStorage.removeItem("tokendata");
window.localStorage.setItem("tokendata",JSON.stringify("you are logged out"));

    setLogout(1)

}

function sendImage(){
  setImageupload(1)
}
function closesendImage(){
  setImageupload(0)
}


  function cusToken(){
    window.localStorage.setItem("tokendata",JSON.stringify(customToken));
    // setLogin(1);
    setRefresh(1)
    setPrintval("   ")
    window.location.reload() 
  }


  return (
    <div className="App" >
     

     {login==2&&login!==0?(<div>Please wait...</div>):(<div></div>)}


      {login==0?(<>
        <h3 style={{color:'white'}}>Enter the token to login.</h3>
        {/* <form onSubmit={userlogin}>
        <input type="text"  placeholder='Enter username' value={name} onChange={(e)=>{
            setName(e.target.value)
          }} ></input>
          <input type="text"  placeholder='Enter password' value={password} onChange={(e)=>{
            setPassword(e.target.value)
          }} ></input>
          <button type="submit">Enter</button>
          </form> */}
          <input type="text"  placeholder='Enter the token' value={customToken} onChange={(e)=>{
            setCustomToken(e.target.value)
          }} ></input>
          <button onClick={cusToken}>Login</button>
          <p>{printval}</p>

      </>):
      (<><div style={{position:'fixed',height:50,width:'100%',background:'grey'}}>
        <h4 style={{color:'whitesmoke',marginTop:8}}> {userName}
        &#160;&#160;&#160;&#160;<button style={{fontWeight:'bold',borderRadius:10,background:'none',outline:'none',border:'none',fontSize:20,marginTop:5,position:'absolute'}} onClick={deleteToken}><FaPowerOff style={{fontWeight:'bold',fontSize:20,color:'pink'}}/></button>

        
        </h4>
      
      </div>
       <div style={{height:500,width:10}}></div>

     {/* LOADING CHATS FROM THE DATABASE */}
     {prevChat.map((payload,index)=>{
            // return(<p>{payload.message}:<span>{payload.userName}</span></p>)
             return(<div>
              {payload.userName!==userName?(<>
              <div style={{height:15,width:100,background:'green',marginLeft:0,position:'absolute',borderRadius:3,background:'none',alignItems:'left',fontSize:11,fontWeight:'bold',color:'grey'}}>{payload.userName}</div>

              <div style={{height:'auto',paddingTop:15,paddingLeft:7,paddingRight:3,paddingBottom:10,width:180,background:'orange',marginTop:7,marginLeft:15,borderRadius:3,color:'whitesmoke',fontWeight:'bold',fontSize:15,textAlign:'left'}}>{payload.message}</div></>):
              
              (<div style={{height:'auto',padding:7,width:180,background:'#5F9EA0',marginTop:7,marginLeft:'45%',borderRadius:3,color:'whitesmoke',fontWeight:'bold'}}>{payload.message}</div>)} 

              {/* <div style={{height:15,width:100,marginLeft:120,position:'absolute',borderRadius:3,background:'none',alignItems:'left',fontSize:11,fontWeight:'bold',color:'blue',marginTop:-17}}>05:05 PM</div> */}
              </div>)



          })}

     {/* LOADING CHAT IN REAL TIME */}
       {chat.map((payload,index)=>{
            // return(<p>{payload.message}:<span>{payload.userName}</span></p>)
            return(<div>
              {payload.userName!==userName?(<>
              <div style={{height:15,width:100,background:'green',marginLeft:0,position:'absolute',borderRadius:3,background:'none',alignItems:'left',fontSize:11,fontWeight:'bold',color:'grey'}}>{payload.userName}</div>

              <div style={{height:'auto',paddingTop:15,paddingLeft:7,paddingRight:3,paddingBottom:10,width:180,background:'orange',marginTop:7,marginLeft:15,borderRadius:3,color:'whitesmoke',fontWeight:'bold',fontSize:15,textAlign:'left'}}>{payload.message}</div></>):
              
              (<div style={{height:'auto',padding:7,width:180,background:'#5F9EA0',marginTop:7,marginLeft:'45%',borderRadius:3,color:'whitesmoke',fontWeight:'bold'}}>{payload.message}</div>)} 

              {/* <div style={{height:15,width:100,marginLeft:120,position:'absolute',borderRadius:3,background:'none',alignItems:'left',fontSize:11,fontWeight:'bold',color:'blue',marginTop:-17}}>05:05 PM</div> */}
              </div>)

          })}

          <div style={{height:40,width:'100%'}}></div>
    
       <form style={{position:'fixed',bottom:0,background:"grey",width:'100%',borderRadius:30}}  onSubmit={sendChat}>
          <input style={{width:'70%',outline:'none',border:'none',fontSize:28,paddingTop:5,paddingBottom:0,background:'none',color:'whitesmoke'}} type="text" name="chat" placeholder='Message' value={message} onChange={(e)=>{
            setMessage(e.target.value)
          }} ></input>
          &#160;&#160;
           {/* <MdInsertPhoto onClick={sendImage} style={{fontSize:34,color:'#FF00FF'}}/> */}
          
          {message!==''?(<button type="submit" style={{fontSize:32,background:'none',outline:'none',border:'none',borderRadius:40,padding:10,color:'white'}}><MdSend style={{marginTop:0,fontSize:32,color:'#5F9EA0',}}/></button>):(<button type="submit" style={{fontSize:32,background:'none',outline:'none',border:'none',borderRadius:40,padding:10,color:'white'}}><MdSend style={{marginTop:0,fontSize:32,color:'black',}}/></button>)}
          
        </form>
      </>)}
      {imageupload==1?(<div style={{height:150,width:'100%',background:'green',position:'fixed',bottom:0,borderTopLeftRadius:20,borderTopRightRadius:20,WebkitTransitionProperty:'all',WebkitTransitionDuration:'.5s'}}>
      <AiOutlineClose onClick={closesendImage} style={{fontSize:30,marginLeft:'85%',marginTop:10}}/>

      </div>):(<></>)}
      

    <div style={{height:30,width:40,background:'none'}}></div>
      
    </div>
  );
}

export default App;
