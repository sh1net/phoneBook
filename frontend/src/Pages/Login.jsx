import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import '../Styles/Login.css';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from '@mui/material';
import { login } from '../api/api'
import { useDispatch } from 'react-redux';
import { setIsAuth, setUser } from '../redux/authSlice';
import backgroundImage from '../images/mgw-fon.png';
import logoImage from '../images/MGW_logo_print.png';
import { toast, Toaster } from "react-hot-toast";

function Login() {

    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [eye, setEye] = useState(true);
    const [error, setError] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (!userName || !userPassword) {
            setError('Username and password are required');
            return;
        }

        const result = await login(userName, userPassword);
        if (result) {
            if(!result.error){
                localStorage.setItem('user', JSON.stringify(result));
                dispatch(setIsAuth(true));
                dispatch(setUser(result));
            }else{
                toast.error(result.error);
            }
        } else {
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleUserName = (e) => {
        setUserName(e.target.value)
    }

    const handleUserPassword = (e) => {
        setUserPassword(e.target.value)
    }

    const toggleEye = () => {
        setEye(!eye);
    };

    return (
        <div className='login_modal_main_container' style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <Toaster toastOptions={{ duration: 4000 }} />
            <img src={logoImage} alt="Logo" className='login_modal_logo' />
            <div className='login_modal_container'>
                <p className='login_modal_header_name'>Вход в телефонную книгу</p>
                <div className='login_modal_enter_field'>
                    <div className='login_modal_password_container'>
                        <TextField
                            id="outlined-basic"
                            label="Имя пользователя"
                            variant="outlined"
                            className='login_modal_input_password'
                            value={userName}
                            onChange={handleUserName}
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: '2px solid black',
                                    borderRadius: '9px'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'darkgray',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'dimgray',
                                },
                            }}
                        />
                    </div>
                    <div className='login_modal_password_container'>
                        <TextField
                            id="outlined-basic"
                            label="Пароль"
                            variant="outlined"
                            className='login_modal_input_password'
                            type={eye ? 'password' : 'text'}
                            value={userPassword}
                            onChange={handleUserPassword}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: '2px solid black',
                                    borderRadius: '9px'
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'darkgray',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'dimgray',
                                },
                            }}
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    eye
                                        ? <IoMdEye className='login_modal_eye' onClick={toggleEye} />
                                        : <IoMdEyeOff className='login_modal_eye' onClick={toggleEye} />

                                ),
                            }}
                        />
                    </div>
                    <Button
                        variant="outlined"
                        className='login_modal_enter_button'
                        onClick={handleSubmit}
                    >
                        Войти
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Login;
