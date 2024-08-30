import Logo from '../../img/logoApp.png'
import Users from '../Users/Users'
import { useState } from 'react'
import search from '../../img/searchIcon.png'

import "./Search.css"

const Search = ({ setMadal }) => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className='searchUser'>
      <div className="searchBox">
        <img width={40} className='logoApp' src={Logo} alt="logoApp" />
        <div className="searchInputBox">
          <input type="text" className="searchInput" placeholder='Search' name='name' value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}/>
          <img src={search} alt="Search" className='searchIcon'/>
        </div>
      </div>
      <h1>All users</h1>
      <Users setMadal={setMadal} searchTerm={searchTerm}/>
    </div>
  )
}

export default Search