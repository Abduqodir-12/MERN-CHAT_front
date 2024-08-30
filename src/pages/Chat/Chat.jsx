import React, { useEffect, useState } from 'react'
import { useInfoContext } from '../../context/Context'
import Search from '../../components/Search/Search'
import ChatBox from '../../components/ChatBox/ChatBox'
import { io } from 'socket.io-client'
import './Chat.css'
import { getUserChats } from '../../api/chatRequests'
import Conversation from '../../components/Conversation/Conversation'
import Settings from '../../img/Settings.png'
import LogOut from '../../img/log out.png'
import Madal from '../../components/Madal/Madal'
const serverUrl = process.env.REACT_APP_SERVER_URL;

const socket = io(serverUrl)

const Chat = () => {
  const {exit, currentUser, chats, setChats, setOnlineUsers, setUserInfo} = useInfoContext()
  const [madal, setMadal] = useState(false)
  const [sendMessage, setSendMessage] = useState(null)
  const [answerMessage, setAnswerMessage] = useState(null)

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await getUserChats()
        setChats(res.data.chats)
      } catch (error) {
        console.log(error);        
      }
    }
    getChats()
  }, [setChats, currentUser._id])

  // socket.io
  useEffect(() => {
    socket.emit('newUserAdd', currentUser._id)
    socket.on('getUsers', (users) => {
      setOnlineUsers(users)
    })
  }, [currentUser._id, setOnlineUsers])

  // send message to socket server
  useEffect(() => {
    if(sendMessage !== null) {
      socket.emit('sendMessage', sendMessage)
    }
  }, [sendMessage])

  useEffect(() => {
    socket.on('answerMessage', (data) => {
      setAnswerMessage(data)
    })
  }, [sendMessage])

  return (
    <div className='chatPage'>
        <div className="leftSide">
          {/* search and users list */}
          <Search setMadal={setMadal}/>
        </div>

        <div className="middleSide">
          {/* conversation */}
          <ChatBox setMadal={setMadal} setSendMessage={setSendMessage} answerMessage={answerMessage}/>
        </div>

        <div className="rightSide">
          {/* chats list */}
          <div className="sideTop">
            <h2 className='h1Heading'>Chat List</h2>
            <button className="btnSettings" onClick={() => {
              setMadal('settings')
              setUserInfo(currentUser)
            }}><img width={20} src={Settings} alt="settings" /></button>
            <button className='btnExit' onClick={exit}><img width={20} src={LogOut} alt="logOut" /></button>
          </div>
          <div className="chatList">
            {
              chats.length > 0 ? chats.map(chat => {
                return (
                  <div key={chat._id} className="chatItem">
                    <Conversation chat={chat} />
                  </div>
                )
              }) : <h3>Chats not found</h3>
            }
          </div>
        </div>
          {madal && <Madal madal={madal} setMadal={setMadal}/>}
    </div>
  )
}

export default Chat
