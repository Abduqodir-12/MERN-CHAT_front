import Logo from '../../img/logoApp.png'
import Users from '../Users/Users'
import { useState } from 'react'
import Conversation from '../../components/Conversation/Conversation'

import "./Search.css"
import { useInfoContext } from '../../context/Context'

const Search = ({ setMadal }) => {
  const {setUserInfo, currentUser, chats, chatsTrue, setChatsTrue} = useInfoContext()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='searchUser'>
      <div className="searchBox">
        <img onClick={() => {
              setMadal('settings')
              setUserInfo(currentUser)
            }} width={40} className='logoApp' src={Logo} alt="logoApp" />
        <div className="searchInputBox">
          <input onClick={() => setChatsTrue(true)} type="text" className="searchInput" placeholder='Search' name='name' value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}/>
          <button className={chatsTrue ? 'searchIcon' : 'ChatPageFalse'} onClick={() => setChatsTrue(false)}>X</button>
        </div>
      </div>
      <Users setMadal={setMadal} searchTerm={searchTerm}/>

      <div className={chatsTrue ? 'ChatPageFalse' : 'ChatPageTrue'}>
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
    </div>
  )
}

export default Search