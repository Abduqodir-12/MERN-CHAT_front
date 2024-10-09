import React, { useEffect, useState } from 'react'
import userIcon from '../../img/userIcon.png'
import { toast } from 'react-toastify'
import { getAllUsers } from '../../api/userRequests'
import { createChat } from '../../api/chatRequests'
import { useInfoContext } from '../../context/Context'
import MsgBtn from '../../img/messageIcon.png'

import './Users.css'

const Users = ({ setMadal, searchTerm }) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    const [users, setUsers] = useState([])
    const { currentUser, onlineUsers, setUserInfo, setChats, chats, setCurrentChat, chatsTrue, setMediaNone } = useInfoContext()

    // get all users
    useEffect(() => {
        const getUsers = async () => {
            try {
                toast.loading('Please wait...')
                const res = await getAllUsers()
                toast.dismiss()
                setUsers(res.data.users)
            } catch (error) {
                toast.dismiss()
                toast.error(error?.response?.data.message)
                console.log(error);
            }
        }
        getUsers()
    }, [])

    const findChat = async (firstId, secondId) => {
        try {
            const { data } = await createChat(firstId, secondId)
            if(!chats?.some(chat => chat._id === data?.chat._id)) {
                setChats([...chats, data?.chat])
            }
            setCurrentChat(data?.chat)
        } catch (error) {
            console.log(error);            
        }
    }

    const online = (userId) => {
        const onlineUser = onlineUsers.find(user => user.userId === userId)
        return onlineUser ? true : false
    }
    const filteredUsers = users.filter(user =>
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className={chatsTrue ? 'SearchPageFalse' : 'SearchPageTrue'}>
            {
                filteredUsers.map((user, index) => {
                    if (user._id !== currentUser._id) {
                        return (
                            <div key={index}>
                                <div className="userInfoBox">
                                    <div className="onlineDot">
                                        <img onClick={() => {
                                            setUserInfo(user)
                                            setMadal('info')
                                        }} src={user.profilePicture ? `${serverUrl}/${user.profilePicture}` : userIcon} alt="profileImg" className='profileImg' />
                                        <div>
                                            <h4 className='name'>{user?.firstname}</h4>
                                            <span className={online(user._id) ? 'status' : 'statusOff'}> {online(user._id) ? 'online' : 'offline'}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => findChat(user._id, currentUser._id)} onClickCapture={() => setMediaNone(true)} className='msgBtn'><img width={30} src={MsgBtn} alt="msgBtn" /></button>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

export default Users