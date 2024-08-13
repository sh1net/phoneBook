import React, { useState } from 'react';
import '../Styles/Search.css';
import TextField from '@mui/material/TextField';
import { FaSearch } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { setSearchParams } from '../redux/searchSlice'; // Ensure the correct path

function Search() {
    const [localSearchParams, setLocalSearchParams] = useState('');
    const dispatch = useDispatch();

    const handleSearchParams = (e) => {
        setLocalSearchParams(e.target.value);
    };

    const handleSearchClick = () => {
        const trimmedSearchParams = localSearchParams.trim();
        dispatch(setSearchParams(trimmedSearchParams));
    };

    const clearSearchParams = () => {
        setLocalSearchParams('');
        dispatch(setSearchParams(''));
    };

    return (
        <div className='search_container'>
            <TextField
                id="outlined-basic"
                variant="outlined"
                className='search_input'
                placeholder='Поиск...'
                onChange={handleSearchParams}
                value={localSearchParams}
                InputProps={{
                    endAdornment: localSearchParams && (
                        <IoIosCloseCircleOutline
                            className='search_close_icon'
                            onClick={clearSearchParams}
                        />
                    ),
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        handleSearchClick();
                    }
                }}
            />
            <FaSearch
                className='search_icon'
                onClick={handleSearchClick}
            />
        </div>
    );
}

export default Search;