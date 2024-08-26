import './Styles/App.css';
import Main from './Pages/Main';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuth, setUser } from './redux/authSlice';
import { useEffect } from 'react';
import Login from './Pages/Login';
import { validateUser } from './api/userApi';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const user = JSON.parse(userData);

        if (user && !user.error) {
          validateUser(user.id).then((dbUser) => {
            if (dbUser) {
              dispatch(setUser(dbUser));
              dispatch(setIsAuth(true));
            } else {
              dispatch(setIsAuth(false));
            }
          }).catch((error) => {
            console.error("Ошибка валидации пользователя:", error);
            dispatch(setIsAuth(false));
          });
        } else {
          dispatch(setIsAuth(false));
        }
      } catch (error) {
        console.error("Ошибка парсинга JSON:", error);
        dispatch(setIsAuth(false));
      }
    } else {
      dispatch(setIsAuth(false));
    }
  }, [dispatch]);

  if (!isAuth) {
    return <Login />;
  }

  return (
    <>
      <Main />
    </>
  );
}

export default App;
