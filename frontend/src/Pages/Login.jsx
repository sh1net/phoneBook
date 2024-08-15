import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import '../Styles/Login.css';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from '@mui/material';
import { login } from '../api/api'

function Login({ closeModal }) {

    const [userName, setUserName] = useState('')
    const [userPassword, setUserPassword] = useState('')

    const handleSubmit = async () => {
        const result = await login(userName, userPassword);
        if (result) {
            console.log(result);
        } else {
            console.log('error')
        }
    };
    const handleUserName = (e) => {
        setUserName(e.target.value)
    }

    const handleUserPassword = (e) => {
        setUserPassword(e.target.value)
    }

    const [eye, setEye] = useState(true);

    const toggleEye = () => {
        setEye(!eye);
    };

    return (
        <div className='login_modal_main_container'>
            <div className='login_modal_container'>
                <div className='login_modal_header_container'>
                    <p className='login_modal_header_name'>Вход</p>
                    <p className='login_modal_close_button' onClick={closeModal}>&times;</p>
                </div>
                <div className='login_modal_enter_field'>
                    <div className='login_modal_password_container'>
                        <TextField
                            id="outlined-basic"
                            label="Имя пользователя"
                            variant="outlined"
                            className='login_modal_input_password'
                            value={userName}
                            onChange={handleUserName}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'gray',
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
                                    borderColor: 'gray',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'darkgray',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'dimgray',
                                },
                            }}
                        />
                        {eye
                            ? <IoMdEye className='login_modal_eye' onClick={toggleEye} />
                            : <IoMdEyeOff className='login_modal_eye' onClick={toggleEye} />
                        }
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
