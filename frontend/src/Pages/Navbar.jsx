import React, { useEffect, useState } from 'react'
import '../Styles/Navbar.css'
import mzh from '../images/MGW_logo_print.png'
import Login from './Login'
import { Button } from '@mui/material';
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import Search from '../components/Search';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthIsAuth, selectAuthUser, setIsAuth, setUser } from '../redux/authSlice'

function Navbar({ onProfileClick, onLogoClick }) {

    const [isLogin, setIsLogin] = useState(false)

    const dispatch = useDispatch()

    const isAuth = useSelector(selectAuthIsAuth);
    const user = useSelector(selectAuthUser);

    const OpenLoginModal = () => {
        setIsLogin(true)
    }

    const closeLoginModal = () => {
        setIsLogin(false)
    }

    const logout = () => {
        dispatch(setIsAuth(false))
        dispatch(setUser({}))
        localStorage.removeItem('user')
        window.location.reload()
    }

    useEffect(() => {
        document.body.style.overflow = isLogin ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isLogin]);

    return (
        <div className='navbar_container'>
            <div className='navbar_img_container' onClick={onLogoClick}>
                <img src={mzh} className='logo_img' />
            </div>
            <div className='button_navbar_container'>
                <Search />
                {isAuth ?
                    <div className='navbar_user_logout_container'>
                        <div className='navbar_user_profile_container' onClick={onProfileClick}>
                            <p className='navbar_user_profile_name'>{user.name}</p>
                            <p className='navbar_user_profile_role'>
                                {user.role === 'admin'
                                    ? 'Администратор'
                                    : user.role === 'manager'
                                        ? 'Менеджер'
                                        : 'Пользователь'}
                            </p>
                        </div>
                        <Button
                            className='navbar_login_button'
                            variant="outlined"
                            endIcon={<IoMdLogOut />}
                            onClick={logout}
                        >Выйти</Button>
                    </div>
                    :
                    <Button
                        className='navbar_login_button'
                        variant="outlined"
                        endIcon={<IoMdLogIn />}
                        onClick={OpenLoginModal}
                    >Войти</Button>
                }
            </div>
            {isLogin && <Login closeModal={closeLoginModal} />}
        </div>
    )
}

export default Navbar
