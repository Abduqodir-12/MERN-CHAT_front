import React, { useState } from 'react'
import CoverImg from '../../img/png-clipart-poster-paper-cover-template-blue-other.png'
import { useInfoContext } from '../../context/Context'
import ProfileImg from '../../img/userIcon.png'
import { toast } from 'react-toastify'
import { deleteUser, updateUser } from '../../api/userRequests'
import delImg from '../../img/delete.233x256.png';
import LogOut from '../../img/log out.png'

import './Madal.css'
const serverUrl = process.env.REACT_APP_SERVER_URL;

const Madal = ({ madal, setMadal }) => {
  const { exit, setCurrentUser, userInfo, setUserInfo } = useInfoContext()
  const [update, setUpdate] = useState(false)


  const handleEditForm = async (e) => {
    e.preventDefault()
    try {
      setUpdate(true)
      const formData = new FormData(e.target)
      const { data } = await updateUser(userInfo._id, formData)
      setCurrentUser(data.user)
      localStorage.setItem('account', JSON.stringify(data.user))
      setUserInfo(data.user)
      setUpdate(false)
    } catch (error) {
      toast.dismiss()
      toast.error(error.response.data.message)
      console.log(error);
    }
  }

  const handleDeleteAccount = async () => {
    let confirm = window.confirm('Rostanham ochirmohchimsz ?')
    try {
      if(confirm) {
        await deleteUser(userInfo._id)
        toast.success("Account deleted successfully")
        localStorage.removeItem('account')
        setCurrentUser(null)
        setUserInfo(null)
        setMadal(false)
        exit()
      }
    } catch (error) {
      toast.dismiss()
      toast.error(error.response.data.message)
      console.log(error);
    }
  }

  return (
    <div className='infoMadal'>
      <button className='closeBtn' onClick={() => setMadal(false)}>X</button>
      <div className="infoCard">
        <div className="profileImages">
          <img src={userInfo?.coverPicture ? `${serverUrl}/${userInfo.coverPicture}` : CoverImg} alt="coverImg" className="coverImg" />
          <img src={userInfo?.profilePicture ? `${serverUrl}/${userInfo.profilePicture}` : ProfileImg} alt="profileImg" className="profilePicture" />
        </div>

        {
          madal === 'info' ?
            <>
              <h3 className='nameUser'>Name: {userInfo.firstname}</h3>
              <h3 className='nameUser'>Surname: {userInfo.lastname}</h3>
              <h3 className='nameUser'>Email: {userInfo.email}</h3>
              <h3 className='nameUser'>Relationship: {userInfo.relationship}</h3>
              <h3 className='nameUser'>About: {userInfo.about}</h3>
              <h3 className='nameUser'>Country: {userInfo.country}</h3>
              <h3 className='nameUser'>LivesIn: {userInfo.livesIn}</h3>
              <h3 className='nameUser'>Works: {userInfo.works}</h3>
            </> :
            <>
              <form onSubmit={handleEditForm} action="" className='updateForm'>
                <input type="text" name='firstname' className="updateName" placeholder='Enter your name' defaultValue={userInfo.firstname} />
                <input type="text" name='lastname' className="updateName" placeholder='Enter your surname' defaultValue={userInfo.lastname} />
                <input type="text" name='email' className="updateName" placeholder='Enter your email' defaultValue={userInfo.email} />
                <input type="text" name='relationship' className="updateName" placeholder='Enter your relationship' defaultValue={userInfo.relationship} />
                <input type="text" name='about' className="updateName" placeholder='Enter your about' defaultValue={userInfo.about} />
                <input type="text" name='country' className="updateName" placeholder='Enter your country' defaultValue={userInfo.country} />
                <input type="text" name='livesIn' className="updateName" placeholder='Enter your lives in' defaultValue={userInfo.livesIn} />
                <input type="text" name='works' className="updateName" placeholder='Enter your works' defaultValue={userInfo.works} />

                <div className='imgInputBox'>
                  <label htmlFor="editFileInput">
                    ProfilePicture
                    <input type="file" name="profilePicture" id="editFileInput" />
                  </label>
                  <label htmlFor="editFileInput2">
                    CoverPicture
                    <input type="file" name="coverPicture" id="editFileInput2" />
                  </label>
                </div>

                <button disabled={update} className="btnUpdate">{update ? "Updating..." : "Update"}</button>
                <button className="btnDelete" onClick={handleDeleteAccount}><img width={20} src={delImg} alt='delImg'/></button>
                <button className='btnExit' onClick={exit}><img width={20} src={LogOut} alt="logOut" /></button>
              </form>
            </>
        }
      </div>
    </div>
  )
}

export default Madal