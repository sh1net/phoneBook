import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    searchParams: ''
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchParams: (state, action) => {
            state.searchParams = action.payload;
        }
    }
});

export const { setSearchParams } = searchSlice.actions;
export const selectSearchParams = (state) => state.search.searchParams;
export default searchSlice.reducer;
