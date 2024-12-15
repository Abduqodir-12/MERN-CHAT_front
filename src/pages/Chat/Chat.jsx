import React, { useEffect, useState } from 'react'
import { useInfoContext } from '../../context/Context'
import Search from '../../components/Search/Search'
import ChatBox from '../../components/ChatBox/ChatBox'
import { io } from 'socket.io-client'
import './Chat.css'
import { getUserChats } from '../../api/chatRequests'
import Madal from '../../components/Madal/Madal'
const serverUrl = process.env.REACT_APP_SERVER_URL;

const socket = io(serverUrl)

const Chat = () => {
  const { currentUser, setChats, setOnlineUsers, mediaNone } = useInfoContext()
  const [madal, setMadal] = useState(false)
  const [sendMessage, setSendMessage] = useState(null)
  const [answerMessage, setAnswerMessage] = useState(null)

  useEffect(() => {
    const getChats = async () => {
      try {
        const res = await getUserChats()
        setChats(res?.data?.chats)
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
    if (sendMessage !== null) {
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
      <div className={mediaNone ? 'dnone' : 'leftSide'}>
        {/* search and users list */}
        <Search setMadal={setMadal} />
      </div>

      <div className={mediaNone ? 'middleSide' : 'dnone'}>
        {/* conversation */}
        <ChatBox setMadal={setMadal} setSendMessage={setSendMessage} answerMessage={answerMessage} />
      </div>
      {madal && <Madal madal={madal} setMadal={setMadal} />}
    </div>
  )
}

export default Chat