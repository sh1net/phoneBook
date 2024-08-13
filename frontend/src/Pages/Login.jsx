import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import '../Styles/Login.css';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Button } from '@mui/material';

function Login({ closeModal }) {
    const [user, setUser] = useState('');

    const handleChange = (event) => {
        setUser(event.target.value);
    };

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
                <TextField
                            id="outlined-basic"
                            label="Логин"
                            variant="outlined"
                            className='login_modal_input_password'
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
                    <div className='login_modal_password_container'>
                        <TextField
                            id="outlined-basic"
                            label="Пароль"
                            variant="outlined"
                            className='login_modal_input_password'
                            type={eye ? 'password' : 'text'}
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
                    >
                        Войти
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Login;
