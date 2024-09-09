import React, { useState } from 'react'
import { login, signup } from '../api/authRequests'
import { toast } from 'react-toastify'
import { useInfoContext } from '../context/Context'

const Auth = () => {
  const { setCurrentUser } = useInfoContext();
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading ] = useState(false)
  
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      toast.loading("Please wait...")
      const formData = new FormData(e.target)
      let res;
      if (isSignup) {
        res = await signup(formData)
      } else {
        res = await login(formData)
      }

      toast.dismiss()
      toast.info(res.data.message)
      localStorage.setItem('account', JSON.stringify(res.data.user))
      localStorage.setItem('token', JSON.stringify(res.data.token))
      setCurrentUser(res.data.user)
      setLoading(false)
    } catch (error) {
      toast.dismiss()
      toast.error(error?.response?.data.message)
      console.log(error);
    }
  }

  return (
    <div className='container'>
      <h1 className='headingTop'>{isSignup ? "Signup Page" : "Login Page"}</h1>

      <form onSubmit={handleSubmit} className="authForm">
        {isSignup &&
          <>
            <input type="text" name='firstname' className='authInput' placeholder='Enter your name' required />
            <input type="text" name='lastname' className='authInput' placeholder='Enter your surname' required />
          </>
        }
        <input type="email" name='email' className='authInput' placeholder='Enter your email' required />
        <input type="password" name='password' className='authInput' placeholder='Enter your password' required />

        <button disabled={loading} className='authBtn'>{isSignup ? "Signup" : "Login"}</button>
      </form>
      <span onClick={() => setIsSignup(!isSignup)} className="auth-span my-3 text-decoration-underline d-block mx-auto">{isSignup ? "I have an Account. Login" : "I don't have an Account. Signup"}</span>
    </div>
  )
}

export default Auth