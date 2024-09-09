import React, { useEffect, useState } from 'react'
import { useInfoContext } from '../../context/Context'
import { getUsers } from '../../api/userRequests';
import userIcon from '../../img/userIcon.png'
import {deleteChat} from '../../api/chatRequests'
import { toast } from 'react-toastify';
import delImg from '../../img/delete.233x256.png';
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Conversition = ({chat}) => {
    const {currentUser, exit, onlineUsers, setCurrentChat, setMediaNone, setChats} = useInfoContext()
    const [userData, setUserData] = useState(null)

    const userId = chat.members.find(id => id !== currentUser._id)
    
    useEffect(() => {
        const getUserData = async () => {
            try {
                const {data} = await getUsers(userId)
                setUserData(data.user)
            } catch (error) {
                console.log(error);             
            }
        }
        getUserData()
    }, [userId, exit])

    const delChat = async (chatId) => {
        const confirmDel = window.confirm("Rostanham ochirmohchimisz ?")
        if(confirmDel) {
            try {
                const {data} = await deleteChat(chatId)
                setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
                toast.success('Chat deleted success')
            } catch (error) {
                console.log(error);                
            }
        }
    }

    const online = (userId) => {
        const onlineUser = onlineUsers.find(user => user.userId === userId)
        return onlineUser ? true : false
    }
  return (
    <div onClick={() => setCurrentChat(chat)} onClickCapture={() => setMediaNone(true)} className="userInfoBox cursorBox">
        <div className="onlineDot">
            <img src={userData?.profilePicture ? `${serverUrl}/${userData?.profilePicture}` : userIcon} alt="profileImg" className='profileImg' />
            <div>
                <h4 className='name'>{userData?.firstname} {userData?.lastname}</h4>
                <span className={online(userId) ? 'status' : 'statusOff'}> {online(userId) ? 'online' : 'offline'}</span>
                <button className='delBtn' onClick={() => delChat(chat._id)}><img className='delBtnImg' src={delImg} alt='delImg'/></button>
            </div> 
        </div>
    </div>
  )
}

export default Conversition