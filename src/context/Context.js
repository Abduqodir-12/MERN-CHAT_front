import { createContext, useContext, useState } from "react";


const InfoContext = createContext();

export const useInfoContext = () => useContext(InfoContext)

export const InfoProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('account')) || null)

  const [chats, setChats] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [chatsTrue, setChatsTrue ] = useState(false)
  const [mediaNone, setMediaNone] = useState(false);

  const exit = () => {
    localStorage.clear()
    setCurrentUser(null)
    setCurrentChat(null)
  };

  const value = {
    currentUser, setCurrentUser,
    exit,
    chats, setChats,
    onlineUsers, setOnlineUsers,
    userInfo, setUserInfo,
    currentChat, setCurrentChat,
    newMessage, setNewMessage,
    chatsTrue, setChatsTrue,
    mediaNone, setMediaNone
  }

  return (
    <InfoContext.Provider value={value}>
      <InfoContext.Consumer>
        {() => children}
      </InfoContext.Consumer>
    </InfoContext.Provider>
  )
}