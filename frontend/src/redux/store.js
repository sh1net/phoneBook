import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './searchSlice';
import authReducer from './authSlice'

const store = configureStore({
    reducer: {
        search: searchReducer,
        auth: authReducer
    }
});

export default store;