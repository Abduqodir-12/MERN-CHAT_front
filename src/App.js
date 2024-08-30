
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './pages/Auth';
import { useInfoContext } from './context/Context';
import Chat from './pages/Chat/Chat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {currentUser} = useInfoContext()
  
  return (
    <div className="App">
     <Routes>
      <Route path='/' element={currentUser ? <Chat/> : <Auth/>} />
      <Route path='/auth' element={<Auth />}/>
     </Routes>
     <ToastContainer />
    </div>
  );
}

export default App;
