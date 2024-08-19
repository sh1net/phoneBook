import './Styles/App.css'
import Main from './Pages/Main'
import { useDispatch } from 'react-redux';
import { setIsAuth, setUser } from './redux/authSlice';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      dispatch(setUser(user));
      dispatch(setIsAuth(true));
    }
  }, [dispatch]);

  return (
    <>
      <Main/>
    </>
  )
}

export default App
