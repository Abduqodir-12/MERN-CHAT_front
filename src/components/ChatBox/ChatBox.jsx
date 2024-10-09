import InputEmoji from "react-input-emoji";
import { format } from 'timeago.js';
import { useEffect, useRef, useState } from "react"
import { useInfoContext } from "../../context/Context"
import "./ChatBox.css"
import { getUsers } from "../../api/userRequests"
import UserIcon from '../../img/userIcon.png'
import { addMessage, deleteMessage, getUserMessages, updateMessage } from '../../api/messageRequests'
import { toast } from "react-toastify"
import send from '../../img/sendImg.png'
import updateImg from '../../img/rightImg.png'
import delImg from '../../img/delete.233x256.png';
import updateImgbtn from '../../img/update.png'
import backImg from '../../img/backImg.png'
const serverUrl = process.env.REACT_APP_SERVER_URL;

const ChatBox = ({ setMadal, setSendMessage, answerMessage }) => {
  const { currentChat, currentUser, setUserInfo, setNewMessage, setMediaNone } = useInfoContext()

  const [userData, setUserData] = useState(null)
  const [messages, setMessages] = useState([])
  const [textMessage, setTextMessage] = useState("")
  const [editMessageId, setEditMessageId] = useState(null)
  const [image, setImage] = useState(null)

  const imgRef = useRef()
  const scrollRef = useRef()

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const userId = currentChat?.members?.find(id => id !== currentUser._id)

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await getUsers(userId)
        setUserData(data?.user)
      } catch (error) {
        console.log(error);
      }
    }

    const getMessages = async () => {
      try {
        const { data } = await getUserMessages(currentChat._id)
        setMessages(data.messages)
      } catch (error) {
        console.log(error);
      }
    }
    if (currentChat && userId) {
      getUserData();
      getMessages();
    }
  }, [userId, currentChat])

  // delete message
  const delMessage = async (id) => {
    let confirm = window.confirm('Rostan ham ochirmohchimisz ?')
    try {
      if (confirm) {
        const res = await deleteMessage(id)
        toast.success(res.data.message)
        setMessages(messages.filter(msg => msg._id !== id))
      }
    } catch (error) {
      console.log(error);
    }
  }

  // update message
  const handleUpdateMessage = async () => {
    try {
      const res = await updateMessage(editMessageId, { text: textMessage })
      toast.success(res.data.message)
      setMessages(messages.map(msg => msg._id === editMessageId ? { ...msg, text: textMessage } : msg))
      setEditMessageId(null)
      setTextMessage("")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSend = async () => {
    const message = {
      senderId: currentUser._id,
      text: textMessage,
      chatId: currentChat._id,
      createdAt: new Date().getTime()
    }

    // const message = new FormData()
    // message.append('chatId', currentChat._id)
    // message.append('senderId', currentUser._id)
    // message.append('text', textMessage)
    // message.append('image', image)

    if (textMessage === "") return

    setSendMessage({ ...message, receivedId: userId })

    try {
      const { data } = await addMessage(message)
      setMessages([...messages, data.message])
      setTextMessage("")
      setImage(null)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (currentChat && answerMessage !== null && answerMessage.chatId === currentChat._id) {
      setMessages([...messages, answerMessage])
    }
  }, [answerMessage])

  const handleText = (e) => {
    setTextMessage(e)
  }

  const startEditMessage = (message) => {
    setEditMessageId(message._id)
    setTextMessage(message.text)
  }

  const handleSendImage = (e) => {
    const file = e.target.files[0]
    setImage(file)
    if(file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewMessage(reader.result)
      };
      reader.readAsDataURL(file)
    }    
  }

  return (
    <div className="chatsBox">
      {
        currentChat ?
          <>
            <div className="userInfo">
              <h1 className="backBtn" onClick={() => setMediaNone(false)}><img width={50} src={backImg} alt="back" /></h1>
              <img onClick={() => {
                setMadal('info')
                setUserInfo(userData)
              }} src={userData?.profilePicture ? `${serverUrl}/${userData?.profilePicture}` : UserIcon} alt="profile" className="profileImage" />
              <h3 className="name">{userData?.firstname} {userData?.lastname}</h3>
            </div>
            <hr />
            <div className="chatBody">
              {messages.map((message, index) => {
                if (message.senderId === currentUser._id) {
                  return (
                    <div ref={scrollRef} key={index} className='right-message-item'>
                      {/* {message.file && <img className="message-img" src={`${serverUrl}/${message.file}`} alt="messageImg" />} */}
                      <p className="textMessageRight">{message.text}</p>
                      <span className="messageTime">{format(message.createdAt)}</span>
                      <button className="chatBoxDelete" onClick={() => delMessage(message._id)}><img className='delBtnImg' src={delImg} alt='delImg'/></button>
                      <button className="chatBoxUpdate" onClick={() => startEditMessage(message)}><img width={25} src={updateImgbtn} alt="updateImg" /></button>
                    </div>
                  )
                } else {
                  return (
                    <div key={index} className='left-message-item'>
                      {/* {message.file && <img className="message-img" src={`${serverUrl}/${message.file}`} alt="messageImg" />} */}
                      <p className="textMessageLeft">{message.text}</p>
                      <span className="messageTime">{format(message.createdAt)}</span>
                    </div>
                  )
                }
              })}
            </div>
            <div className="chatSender">
              {/* <button onClick={() => {
                imgRef.current.click()
              }} className="senderFileBtn">+</button> */}
              <InputEmoji value={textMessage} onChange={handleText}/>
              <button onClick={editMessageId ? handleUpdateMessage : handleSend} className="sendBtn">
                {editMessageId ? <img width={40} src={updateImg} alt='right_img' /> : <img width={40} src={send} alt="sendImg"/>}
              </button>
              <input onChange={handleSendImage}  ref={imgRef} type="file" name="image" className="messageFileInput" />
            </div>
          </>
          :
          <>
            <h2>Tap on a chat to start conversation</h2>
          </>
      }
    </div>
  )
}

export default ChatBox