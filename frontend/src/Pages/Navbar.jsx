import React, { useEffect, useState } from 'react'
import '../Styles/Navbar.css'
import mzh from '../images/MGW_logo_print.png'
import Login from './Login'
import { Button } from '@mui/material';
import { IoMdLogIn } from "react-icons/io";
import Search from '../components/Search';

function Navbar() {

    const [isLogin, setIsLogin] = useState(false)

    const OpenLoginModal = () => {
        setIsLogin(true)
    }

    const closeLoginModal = () => {
        setIsLogin(false)
    }

    useEffect(() => {
        document.body.style.overflow = isLogin ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isLogin]);

    return (
        <div className='navbar_container'>
            <div className='navbar_img_container'>
                <img src={mzh} className='logo_img' />
            </div>
            <div className='button_navbar_container'>
                <Search/>
                <Button
                    className='navbar_login_button'
                    variant="outlined"
                    endIcon={<IoMdLogIn />}
                    onClick={OpenLoginModal}
                >Войти</Button>
            </div>
            {isLogin && <Login closeModal={closeLoginModal}/>}
        </div>
    )
}

export default Navbar
